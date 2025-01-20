import React, { useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import type { SelectProps } from "antd";
import debounce from "lodash/debounce";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

interface UserValue {
  label: string;
  value: string;
}

interface SelectFieldProps {
  users: { email: string }[];
  setValues: any;
}

const SelectField: React.FC<SelectFieldProps> = ({ users, setValues }) => {
  const [value, setValue] = useState<UserValue[]>([]);

  // Fetch options from local data
  const fetchLocalUsers = async (username: string): Promise<UserValue[]> => {
    return users
      .filter((user) =>
        user.email.toLowerCase().includes(username.toLowerCase())
      )
      .map((user) => ({
        label: user.email,
        value: user.email,
      }));
  };

  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="Search email"
      fetchOptions={fetchLocalUsers}
      onChange={(newValue) => {
        setValue(newValue as UserValue[]);
        setValues(newValue);
      }}
      style={{ width: "100%" }}
    />
  );
};

export default SelectField;
