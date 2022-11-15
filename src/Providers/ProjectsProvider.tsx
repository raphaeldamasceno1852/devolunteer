import { createContext, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { toast } from "react-toastify";
import api from "../Services/api";

interface iProject {
  userId: number;
  title: string;
  description: string;
  imgProject: string;
  ongId: number;
  id: number;
  status: "completed" | "pendings";
  tasks: any;
}

interface iCreateTask {
  title: string;
  content: string;
  projectId: number;
}

interface iOng {
  email: string;
  password: string;
  confirmPassword: string;
  github: string;
  linkedin: string;
  fotoDePerfil: string;
  typeUser: "dev" | "ong";
  id: number;
  razaoSocial: string;
  descricaoDaOng: string;
}

interface IProjectsContext {
  projects: iProject[];
  setProjects: React.Dispatch<React.SetStateAction<iProject[]>>;
  requestProjects: () => void;
  menu: boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalHome: boolean;
  setModalHome: React.Dispatch<React.SetStateAction<boolean>>;
  handleMenu: () => void;
  handleModal: () => void;
  handleProjectsToApply: (destination: string) => void;
  scrollToTop: () => void;
  render: string;
  setRender: React.Dispatch<React.SetStateAction<string>>;
  youRight: boolean;
  handleYouRight: (projectId: number) => void;
  applyOnProject: () => void;
  showProject: boolean;
  setShowProjects: React.Dispatch<React.SetStateAction<boolean>>;
  createProjects: (data: iProject) => void;
  HandleModalProject: () => void;
  handleNavigate: (route: string) => void;
  requestMyProject: () => void;
  myProject: iProject;
  requestOngMyProject: () => void;
  dataOngMyProject: iOng;
  requestAddDevOnTask: (id: number) => void;
  requestCompleteTask: (id: number) => void;
  handleManageProject: (projectId: number, ongId: number) => void;
  deleteTask: (id: number) => void;
  deleteProject: (id: number) => void;
  handleCreateTask: () => void;
  createTask: boolean;
  pendingProject: any;
  setPendingProjects: any;
  modalChange: boolean;
  setModalChange: React.Dispatch<React.SetStateAction<boolean>>;
  editProjects: () => void;
  idProject: number;
  setIdProject: React.Dispatch<React.SetStateAction<number>>;
  onSubmitCreateTask: (data: iCreateTask) => void;
  requestCompleteProject: (id: number) => void;
  isAddProjectOpen: boolean;
  setIsAddProjectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenModal: () => void;
}

export const ProjectsContext = createContext<IProjectsContext>(
  {} as IProjectsContext
);

interface IProjectChildren {
  children: ReactNode;
}

export const ProjectsProvider = ({ children }: IProjectChildren) => {
  const [projects, setProjects] = useState<iProject[]>([]);
  const [menu, setMenu] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalHome, setModalHome] = useState<boolean>(false);
  const [render, setRender] = useState<string>("publications");
  const [youRight, setYouRight] = useState<boolean>(false);
  const [showProject, setShowProjects] = useState<boolean>(false);
  const [myProject, setMyProject] = useState<iProject>({} as iProject);
  const [dataOngMyProject, setDataOngMyProject] = useState<iOng>({} as iOng);
  const [createTask, setCreateTask] = useState<boolean>(false);
  const [pendingProject, setPendingProjects] = useState([] as any);
  const [modalChange, setModalChange] = useState<boolean>(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [idProject, setIdProject] = useState(0);

  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsAddProjectOpen(!isAddProjectOpen);
  };

  const handleCreateTask = () => {
    !createTask ? setCreateTask(true) : setCreateTask(false);
  };

  const handleMenu = () => {
    return !menu ? setMenu(true) : setMenu(false);
  };
  const handleModal = () => {
    return !showModal ? setShowModal(true) : setShowModal(false);
  };

  const handleYouRight = (projectId: number) => {
    localStorage.setItem("projectId", projectId + "");
    !youRight ? setYouRight(true) : setYouRight(false);
  };
  const handleProjectsToApply = (destination: string) => {
    setRender(destination);
  };
  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const createProjects = (data: any) => {
    data.userId = +localStorage.userId;
    data.ongId = +localStorage.userId;
    data.status = "pendings";

    api
      .post("/projects", data, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        toast.success("Projeto cadastrado com sucesso!");
        setPendingProjects(res.data);
        requestProjects();
        setShowProjects(false);
      })
      .catch(() => 
      toast.error("Erro ao editar tecnologia")
      );
  };

  const editProjects = () => {
    const data = {
      status: "develop",
    };
    api
      .patch(`/projects/${localStorage.idProject}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setModalChange(false);
        requestProjects();
      });
  };

  const HandleModalProject = () => {
    return !showProject ? setShowProjects(true) : setShowProjects(false);
  };
  const applyOnProject = () => {
    const body = {
      projectId: +localStorage.projectId,
    };
    requestApplyOnProject(body);
  };

  const requestProjects = () => {
    api.get("/projects").then((res) => {
      return setProjects(res.data), setPendingProjects(res.data);
    });
  };

  const requestApplyOnProject = (body: any) => {
    api
      .patch(`/users/${localStorage.userId}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setYouRight(false);
        toast.success(
          "Cadastrado com sucesso no projeto, acesse Meu Projeto para ver os detalhes"
        );
      });
  };

  const requestMyProject = () => {
    api.get(`/projects/${localStorage.projectId}?_embed=tasks`).then((res) => {
      localStorage.setItem("ongId", res.data.ongId);
      setMyProject(res.data);
    });
  };
  const requestOngMyProject = () => {
    api
      .get(`/users/${localStorage.ongId}`)
      .then((res) => setDataOngMyProject(res.data));
  };
  const requestAddDevOnTask = (id: number) => {
    const body = {
      userId: +localStorage.userId,
    };
    api
      .patch(`/tasks/${id}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        requestMyProject();
        requestOngMyProject();
      });
  };

  const requestCompleteTask = (id: number) => {
    const body = {
      completed: true,
    };
    api
      .patch(`/tasks/${id}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        requestMyProject();
        requestOngMyProject();
        toast.success("Tarefa concluída com sucesso!");
      });
  };
  const requestCompleteProject = (id: number) => {
    const body = {
      status: "completed",
    };
    api
      .patch(`/projects/${id}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then(() => {
        toast.success("Projeto concluido!");
        navigate("/dashboard/projectdevelop");
      });
  };

  const handleManageProject = (projectId: number, ongId: number) => {
    localStorage.setItem("projectId", `${projectId}`);
    localStorage.setItem("ongId", `${ongId}`);

    navigate("/dashboard/manageproject");
  };
  const deleteTask = (id: number) => {
    api
      .delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then(() => {
        return requestMyProject();
      });
  };
  const deleteProject = (id: number) => {
    api
      .delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then(() => {
        return requestProjects(), setModalChange(false);
      });
  };

  const onSubmitCreateTask = (data: iCreateTask) => {
    data.projectId = +localStorage.projectId;
    toast.promise(
      api
        .post("/tasks", data, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => {
          setCreateTask(false);
          requestMyProject();
        }),
      {
        pending: "Criando Tarefa",
        success: "Sucesso ao criar a tarefa",
        error: "Erro ao criar a tarefa",
      }
    );
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <ProjectsContext.Provider
      value={{
        scrollToTop,
        requestProjects,
        projects,
        setProjects,
        menu,
        setMenu,
        showModal,
        setShowModal,
        handleMenu,
        handleModal,
        handleNavigate,
        modalHome,
        setModalHome,
        render,
        setRender,
        handleProjectsToApply,
        handleYouRight,
        youRight,
        applyOnProject,
        HandleModalProject,
        createProjects,
        showProject,
        setShowProjects,
        requestMyProject,
        myProject,
        requestOngMyProject,
        dataOngMyProject,
        requestAddDevOnTask,
        requestCompleteTask,
        handleManageProject,
        deleteTask,
        handleCreateTask,
        createTask,
        pendingProject,
        setPendingProjects,
        modalChange,
        setModalChange,
        editProjects,
        idProject,
        setIdProject,
        onSubmitCreateTask,
        requestCompleteProject,
        deleteProject,
        isAddProjectOpen,
        setIsAddProjectOpen,
        handleOpenModal,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
