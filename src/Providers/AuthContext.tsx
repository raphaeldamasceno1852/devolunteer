import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

interface IAuthContext {
    loadingUser: () => void;
    dataUser: iDataUser | iDataOng;
    setDataUser: Dispatch<SetStateAction<iDataUser | iDataOng>>;
}

export interface iDataUser {
    email: string;
    fotoDePerfil: string;
    password: string;
    nome: string;
    id: number;
    typeUser: "dev" | "admin";
    linkedin: string;
    github: string;
}

interface iDataOng {
    email: string;
    password: string;
    razaoSocial: string;
    cnpj: string;
    telefone: string;
    confirmPassword: string;
    nomeDoResponsavel: string;
    fotoDePerfil: string;
    typeUser: "ong";
    id: number;
    descricaoDaOng: string;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthChildren {
    children: ReactNode;
}

export const AuthProvider = ({ children }: IAuthChildren) => {
    const navigate = useNavigate();
    const [dataUser, setDataUser] = useState<iDataUser | iDataOng>(
        {} as iDataUser | iDataOng
    );
    const loadingUser = () => {
        api.get(`/users/${localStorage.userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        })
            .then((res) => {
                setDataUser(res.data);
            })
            .catch(() => navigate("/home"));
    };
    return (
        <AuthContext.Provider value={{ loadingUser, dataUser, setDataUser }}>
            {children}
        </AuthContext.Provider>
    );
};
