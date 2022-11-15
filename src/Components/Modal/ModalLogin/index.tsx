// import { Form } from "../../Form";
import { StyledLoginButton } from "../../Button";
import { InputAndLabel } from "../../Input";
import { StyledBoxModal } from "./style";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUserLogin } from "../../../Services/validation/createUser.validation";
import { UserContext } from "../../../Providers/UserProvider";
import { useContext } from "react";
import { FieldError } from "react-hook-form";
import { StyledForm} from "../../Form/styled";
import { ProjectsContext } from "../../../Providers/ProjectsProvider";
import { useOutSideClick } from "../../../hooks/useOutSideClick";
import { InputAndLabelPassword } from "../../InputPassword";
// import { ButtonCloseModal } from "../../Button/ButtonCloseModal";

interface IUserLogin {
  email: string;
  password: string;
  error?: {
    email?: FieldError;
    password?: FieldError;
  };
}
export const ModalLogin = () => {
  const { onSubmitLogin, shownPassword, togglePassword } = useContext(UserContext);
  const { setShowModal } = useContext(ProjectsContext);
  const modalRef = useOutSideClick(() => {
    setShowModal(false);
  });
  const {
    handleSubmit,
    register,
    formState: {
      errors: { email, password },
    },
  } = useForm<IUserLogin>({
    resolver: yupResolver(schemaUserLogin),
  });

  return (
    <StyledBoxModal>
      <StyledForm ref={modalRef} onSubmit={handleSubmit(onSubmitLogin)}>
        <h2>Já faz parte?</h2>
      
        <InputAndLabel
          textLabel="Email"
          name="email"
          placeholder="Digite seu email"
          type="text"
          register={register}
          error={email?.message}
        />
          <InputAndLabelPassword
            textLabel="Senha"
            name="password"
            placeholder="Digite sua senha"
            type={shownPassword ? "text" : "password"}
            error={password?.message}
            register={register}
          />
        <StyledLoginButton type="submit">Login</StyledLoginButton>
      </StyledForm>
    </StyledBoxModal>
  );
};
