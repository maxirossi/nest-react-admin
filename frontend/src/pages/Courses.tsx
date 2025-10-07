import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

import Pagination from '../components/shared/Pagination';
import usePagination from '../hooks/usePagination';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();
  
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
      }),
  );

  const pagination = usePagination({
    totalItems: data?.length || 0,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      console.log('Saving course...', createCourseRequest);
      await courseService.save(createCourseRequest);
      console.log('Course saved successfully');
      setAddCourseShow(false);
      reset();
      setError(null);
      // Invalidar y refrescar los datos automáticamente después de crear
      console.log('Invalidating queries...');
      await queryClient.invalidateQueries(['courses']);
      console.log('Queries invalidated and data refreshed');
    } catch (error) {
      console.error('Error saving course:', error);
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-3xl">Manage Courses</h1>
        <div className="flex gap-2">
          <button
            className="btn flex gap-2"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {authenticatedUser.role !== 'user' ? (
            <button
              className="btn flex gap-2"
              onClick={() => setAddCourseShow(true)}
            >
              <Plus /> Add Course
            </button>
          ) : null}
        </div>
      </div>
      <hr />

      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <CoursesTable 
        data={data?.slice(pagination.startIndex, pagination.endIndex)} 
        isLoading={isLoading} 
        onRefresh={refetch} 
      />
      
      {data && data.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={pagination.setCurrentPage}
          onPageSizeChange={pagination.setPageSize}
          onNextPage={pagination.goToNextPage}
          onPreviousPage={pagination.goToPreviousPage}
          onFirstPage={pagination.goToFirstPage}
          onLastPage={pagination.goToLastPage}
        />
      )}

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
