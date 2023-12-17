import Room from "../../../components/common/Types/Room";

export default interface RoomDetailProps {
    selectedRoom: Room;
    onEditRoom: (room: Room) => void;
    onDeleteRoom: (room: Room) => void;
  }