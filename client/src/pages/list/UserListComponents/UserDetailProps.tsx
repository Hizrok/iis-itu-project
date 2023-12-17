import User from "../../../components/common/Types/User";

export default interface UserDetailProps {
    selectedUser: User;
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
  }