"use client";

import SpinLoader from "@/components/Loader/SpinLoader";
import Pagination from "@/components/Pagination/Pagination";
import SortableHeader from "@/components/Table/SortableHeader";
import { useQueryFilter } from "@/contexts/FilterQueryContext";
import { useQuries } from "@/contexts/QueriesContext";
import { deleteQueries, deleteQuery } from "@/services/queryServices";
import { QUERY_STATUS } from "@/types/enums";
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

const statusIcons: { [key: string]: JSX.Element } = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  extracting: <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
  extracted: <CheckCheck className="w-5 h-5 text-green-500" />,
  canceled: <XCircle className="w-5 h-5 text-gray-500" />,
  failed: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
};

export default function QueryProcessingView({
  status = undefined,
}: {
  status: QUERY_STATUS | undefined;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { isLoading, totalCount, queries, refreshQueries } = useQuries();
  const { filterOptions, setFilterOptions } = useQueryFilter();
  const [selectedItems, setSelectedItems] = useState(0);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedQueryIds, setSelectedQueryIds] = useState<string[]>([]);

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
    e: React.ChangeEvent<HTMLInputElement>,
    queryId: string
  ) => {
    if (e.target.checked) {
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row */}
                {queries.map((query, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheckboxClick(e, query.id)}
                          checked={selectedQueryIds.includes(query.id)}
                        />
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="hover:underline text-left">
                        {query.query}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center  hover:cursor-pointer">
                        {formatDateTimeReadable(query.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2 capitalize">
                        {statusIcons[query.status]}
                        {query.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex gap-2 items-center">
                        <PenIcon
                          className="w-4 h-4 stroke-blue-500 hover:stroke-blue-700 hover:cursor-pointer"
                          onClick={() => {}}
                        />
                        <TrashIcon
                          className="w-4 h-4 stroke-red-500 hover:stroke-red-700 hover:cursor-pointer"
                          onClick={() => {
                            handleDeleteQuery(query.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
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
    </>
  );
}
