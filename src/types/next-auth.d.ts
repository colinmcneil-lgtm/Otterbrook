import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    companyId?: string;
    companyName?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      companyId?: string;
      companyName?: string;
    };
  }
}
