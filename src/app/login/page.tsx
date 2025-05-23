"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react"
import { toast } from "sonner";


type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const callbackUrl =  "/";


  console.log(errors);

  const onSubmit = async (data: FormValues) => {
    // console.log(data);

    const result = await signIn ("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl,
    })

    console.log("From 38____________________",result);

    if (!result?.ok) {
      return toast.success('Something went wrong');
    }

    return  toast.success('My success toast');

  };

  return (
    <div className="my-10">
      <h1 className="text-center  font-bold text-4xl mb-5">
        Login 
      </h1>
      <div className="flex justify-center items-center ">

        <div className="card w-[70%] max-w-[664px]  h-[80%] shadow-xl  bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body  ">
            <div className="form-control mt-5 p-2">
              <label className="label">
                <span className="label-text">Email : </span>
              </label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Email"
                className="input input-bordered mt-1"
                required
              />
            </div>

            <div className="form-control p-2 ">
              <label className="label">
                <span className="label-text">Password : </span>
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="password"
                className="input input-bordered mt-1"
                required
              />
            </div>

            <div className="form-control mt-6  w-full flex justify-center  ">
              <Button type="submit" className=" w-[50%] ">
                Login
              </Button>

              
            </div>
            <p className="text-center mt-3">
              Don&apos;t have an account?{" "}
              <Link className="text-accent" href="/signup">
                Create an account
              </Link>
            </p>
          </form>
          <p className="text-center pb-5">Or <Link href='/signup' className=" underline" >Sign Up  </Link> </p>
         
        </div>
      </div>
    </div>
  );
};

export default LoginPage;