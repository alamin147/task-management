import { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRemoveShareUserMutation } from "@/redux/features/tasks/tasksApi";
import toast from "react-hot-toast";

interface UserType {
  key: string;
  name: string;
  email: string;
  photo: string;
}

const DeleteShareUsers = ({
  setDeleteShareModal,
  sharedUser,
  taskId,
}: {
  setDeleteShareModal: any;
  sharedUser: any;
  taskId: string;
}) => {
  const [removeShareUser] = useRemoveShareUserMutation();
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: keyof UserType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: keyof UserType
  ): TableColumnType<UserType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => text,
  });

  const handleDelete = async (user: any) => {
    const res = await removeShareUser({ taskId, user });
    // console.log("Deleted ID:", id);
    if (res?.data?.status == 200) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message || "Failed to delete");
    }
  };

  const transformedData: UserType[] = sharedUser?.map((user: any) => ({
    key: user._id,
    name: user.name,
    email: user.email,
    photo: user.photo,
  }));

  const columns: TableColumnsType<UserType> = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img src={photo} alt="User Photo" className="w-10 h-10 rounded-full" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Remove Share",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" danger onClick={() => handleDelete(record.key)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl">
        <div className="flex justify-between mb-3">
          <h1 className="text-lg">Already shared with</h1>
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => setDeleteShareModal(false)}
          >
            &times;
          </button>
        </div>
        <Table<UserType>
          columns={columns}
          pagination={false}
          dataSource={transformedData}
        />
      </div>
    </div>
  );
};

export default DeleteShareUsers;
