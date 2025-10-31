import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ListTodo } from "lucide-react";

const Login: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <Card className="w-[360px]">
        <CardContent className="p-6 space-y-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ToDo Application</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Please register with Google
          </p>
          <Button className="w-1/3 self-center" onClick={loginWithGoogle}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
