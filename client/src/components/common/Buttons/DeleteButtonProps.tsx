import User from '../Types/User'

export default interface DeleteButtonProps {
    user: User;
    onDelete: () => void;
  }