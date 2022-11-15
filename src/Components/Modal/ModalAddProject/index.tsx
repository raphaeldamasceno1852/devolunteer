import * as S from "../../HeaderDashboard/style";

import { useContext } from "react";
import { ProjectsContext } from "../../../Providers/ProjectsProvider";
import { useForm } from "react-hook-form";
import { StyledBoxModalCreateProject, StyledModalAddProject, StyledModalContent } from "./style";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaCreateProject } from "../../../Services/validation/createUser.validation";
import { StyledBoxModal } from "../ModalLogin/style";
import { AuthContext } from "../../../Providers/AuthContext";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { ButtonCloseModal } from "../../Button/ButtonCloseModal";

interface ICreateProjectProps {
    textLabel: string;
    name: string;
    placeholder: string;
    register: () => void;
    title: string;
    description: string;
    userId: number;
    imgProject: string;
    ongId: number;
    id: number;
    status: "completed" | "pendings";
    tasks: any;
}

function ModalCreateProject() {
    
    const { dataUser } = useContext(AuthContext);
    const { createProjects, setShowProjects, isAddProjectOpen, setIsAddProjectOpen, handleOpenModal } = useContext(ProjectsContext);
    const { handleSubmit, register } = useForm<ICreateProjectProps>({
        resolver: yupResolver(schemaCreateProject),
    });
    const modalRef = useOutSideClick(() => {
        setIsAddProjectOpen(false);
    });

    return (
        <StyledBoxModalCreateProject>
            <StyledModalContent>
            <ButtonCloseModal onClick={handleOpenModal}/>
            <StyledModalAddProject
                onSubmit={handleSubmit(createProjects)}
                ref={modalRef}
                >
                <S.User>
                    <S.Name>
                        {dataUser.typeUser == "dev" ||
                        dataUser.typeUser == "admin"
                        ? dataUser.nome
                        : dataUser.typeUser == "ong"
                        ? dataUser.razaoSocial
                            : null}
                    </S.Name>
                    <S.Image
                        src={dataUser.fotoDePerfil}
                        alt="Foto de perfil Ong"
                    />
                </S.User>
                <label>Titulo</label>
                <input placeholder="Insira o Nome" {...register("title")} />
                <input
                    placeholder="Link da imagem"
                    {...register("imgProject")}
                />
                <label>Descrição do Projeto</label>
                <textarea
                    placeholder="Insira o Nome"
                    {...register("description")}
                />
                <button type="submit">Cadastrar</button>
                </StyledModalAddProject>
            </StyledModalContent>
        </StyledBoxModalCreateProject>
    );
}

export default ModalCreateProject;
