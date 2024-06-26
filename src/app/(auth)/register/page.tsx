'use client';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import Spinner from "@/components/spinners/Spinner";
import { useRouter } from "next/navigation";




const userSchema = z.object({
    name: z.string().nonempty("Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type UserSchema = z.infer<typeof userSchema>;

export default function Registrar() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });
    async function handleUserData(data: UserSchema) {
        
        try {
            setLoading(true);
            const response = await axios.post('/api/register', data);
       
            if (response.data.status === 200) {
                router.push('/login');
                toast.success(response.data.message);
            } else if(response.data.status == 400) {
                toast.error(response.data.message);
            }else if(response.data.status == 500){
                toast.error("Server Error: ao registrar usuário");
            }
        } catch (e) {
            toast.error("Server error: " + (e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="relative min-h-screen w-full flex justify-center items-center">
                <Spinner loading={loading} />
                <div className="flex justify-center items-center min-h-screen w-full">
                    <ToastContainer />
                    <section className="p-6 rounded-lg shadow-lg w-full max-w-md container-auth">
                        <header className="home-header pb-4 flex justify-center">
                            <h1 className="text-3xl text-white font-bold">Registrar</h1>
                        </header>
                        <form onSubmit={handleSubmit(handleUserData)}>
                            <div className="mb-4">
                                <label htmlFor="nome" className="block text-light text-white mb-2">Nome completo:</label>
                                <input type="text" {...register('name')} className="form-control w-full px-3 py-2 border border-gray-300 rounded-md" id="nome" />
                                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-light text-white mb-2">Email:</label>
                                <input type="email" {...register('email')} className="form-control w-full px-3 py-2 border border-gray-300 rounded-md" id="email" />
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-light text-white mb-2">Senha:</label>
                                <input type="password" {...register('password')} className="form-control w-full px-3 py-2 border border-gray-300 rounded-md" id="password" />
                                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                            </div>
                            <p className="text-white">já possui conta? <a href="/login" className="text-blue-400 hover:underline">Login</a></p>
                            <div className="flex justify-center mt-4">
                                <button type="submit" className="btn hover:bg-black bg-gray-700 text-white font-bold py-2 px-4 rounded">Registrar</button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
}
