export type TUser = {
    email: string;
    exp: number;
    iat: number;
    id: string;
    name: string;
    photo: string;
    role: "user" | "admin"
  };

  export type TTask = {
    _id:string;
    title: string;
    description?: string;
    dueDate: string;
    status?: "active" | "inactive";
    completed?: boolean;
    priority: "low" | "medium" | "high";
    user: string;
  };
