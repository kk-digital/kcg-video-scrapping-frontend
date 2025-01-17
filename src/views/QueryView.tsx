"use client";

import SpinLoader from "@/components/Loader/SpinLoader";
import QueryFormModal from "@/components/Modal/QueryFormModal";
import Pagination from "@/components/Pagination/Pagination";
import QueryItem from "@/components/SearchQuery/QueryItem";
import SortableHeader from "@/components/Table/SortableHeader";
import { useQueryFilter } from "@/contexts/FilterQueryContext";
import { useQuries } from "@/contexts/QueriesContext";
import {
  deleteQueries,
  deleteQuery,
  updateQuery,
} from "@/services/queryServices";
import { QueryCreateSchema, QueryUpdateSchema } from "@/types";
import { ACTION_TYPE, QUERY_STATUS } from "@/types/enums";
import { formatDateTimeReadable } from "@/utils/format";
import {
  Clock,
  Loader,
  XCircle,
  AlertTriangleIcon,
  XCircleIcon,
  CheckCheck,
  PenIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function QueryProcessingView({
  status = undefined,
}: {
  status: QUERY_STATUS | undefined;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { isLoading, totalCount, queries, refreshQueries } = useQuries();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const { filterOptions, setFilterOptions } = useQueryFilter();
  const [selectedItems, setSelectedItems] = useState(0);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedQueryIds, setSelectedQueryIds] = useState<string[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<
    QueryUpdateSchema | undefined
  >(undefined);

  useEffect(() => {
    setFilterOptions({
      ...filterOptions,
      status: status,
    });
  }, []);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedItems > 0 && selectedItems < queries.length;
      if (selectedItems > 0) {
        setShowBulkActions(true);
      } else {
        setShowBulkActions(false);
      }
    }
  }, [selectedItems, queries.length]);

  const handleBuckCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedItems(queries.length);
      setSelectedQueryIds(queries.map((query) => query.id));
    } else {
      setSelectedItems(0);
      setSelectedQueryIds([]);
    }
    setShowBulkActions(checked);
  };

  const handleCheckboxClick = (
    // e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    queryId: string
  ) => {
    if (checked) {
      setSelectedItems(selectedItems + 1);
      setSelectedQueryIds([...selectedQueryIds, queryId]);
    } else {
      setSelectedItems(selectedItems - 1);
      setSelectedQueryIds(selectedQueryIds.filter((id) => id !== queryId));
    }
  };

  const handleDeleteQueries = () => {
    if (selectedQueryIds.length > 0) {
      deleteQueries(selectedQueryIds)
        .then((success) => {
          if (success) {
            toast.success("Queries deleted successfully");
            setSelectedItems(0);
            setSelectedQueryIds([]);
            setFilterOptions({
              ...filterOptions,
              currentPage: 1,
            });
            refreshQueries();
          } else {
            toast.error("Failed to delete queries");
          }
        })
        .catch(() => {
          toast.error("Failed to delete queries");
        });
    } else {
      toast.info("Please select at least one item to delete.");
    }
  };

  const handleChangeSort = (label: string) => {
    setFilterOptions({
      ...filterOptions,
      orderBy: label,
      isAscending:
        filterOptions.orderBy === label ? !filterOptions.isAscending : true,
    });
  };

  const handleDeleteQuery = (queryId: string) => {
    deleteQuery(queryId).then((success) => {
      if (success) {
        refreshQueries();
        toast.success("Successfully deleted");
      } else {
        toast.success("Failed to delete");
      }
    });
  };

  const handleUpdateQuery = async (
    query: QueryUpdateSchema | QueryCreateSchema
  ): Promise<boolean> => {
    // Type guard to check if it's an update operation
    if ("id" in query) {
      const success = await updateQuery(query as QueryUpdateSchema);
      refreshQueries();
      return success;
    }
    return false; // Or handle create operation if needed
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg min-h-12 mb-2">
        <div className="flex items-center gap-2">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={selectedItems > 0 && selectedItems === queries.length}
            className=""
            onChange={(e) => {
              handleBuckCheckboxChange(e);
            }}
          />
          <span className="text-sm text-gray-600">
            {selectedItems} items selected
          </span>
        </div>
        {showBulkActions && (
          <div className="flex items-center gap-2">
            <button
              className="btn-warning text-sm px-3 py-1 flex items-center gap-1"
              onClick={() => handleDeleteQueries()}
            >
              <XCircleIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col w-full bg-white rounded-lg shadow overflow-y-auto">
        {/* Table */}
        {isLoading ? (
          <SpinLoader />
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="bg-gray-200 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader
                      label="query"
                      value="query"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIDEO GAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-36 overflow-hidden text-ellipsis">
                    <SortableHeader
                      label="created"
                      value="created_at"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader
                      label="status"
                      value="status"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row */}
                {queries.map((query, index) => (
                  <QueryItem
                    query={query}
                    key={index}
                    index={index}
                    onDelete={handleDeleteQuery}
                    onUpdate={() => {
                      setSelectedQuery(query);
                      setIsOpenUpdateModal(true);
                    }}
                    onSelect={(checked: boolean, queryId: string) =>
                      handleCheckboxClick(checked, queryId)
                    }
                    selected={selectedQueryIds.includes(query.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-end px-16">
        <Pagination
          className="pagination-bar"
          totalCount={totalCount}
          pageSize={filterOptions.pageSize}
          onPageChange={(pageSize: number, currentPage: number) => {
            setFilterOptions({
              ...filterOptions,
              pageSize,
              currentPage,
            });
          }}
        />
      </div>
      {/* Update Query Model */}
      {selectedQuery && (
        <QueryFormModal
          initialData={selectedQuery}
          isOpen={isOpenUpdateModal}
          onClose={() => {
            setSelectedQuery(undefined);
            setIsOpenUpdateModal(false);
          }}
          onSubmit={handleUpdateQuery}
          actionType={ACTION_TYPE.UPDATE}
        />
      )}
    </>
  );
}
