export interface User {
  id: string;
  username: string;
  displayPhoto?: string | null;
}

export interface AuthContextValue {
  token: string | null;
  user: User | null;
  handleSetToken: (token: string) => void;
  handleSetUser: (user: User) => void;
  handleLogout: () => void;
}

export interface ResponseBody {
  message: string;
  data: any | null;
  errors: any;
}

export interface PostType {
  id: string;
  image: string;
  title: string;
  slug: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  readTime: number;
}
