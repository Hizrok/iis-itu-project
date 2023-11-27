import Activity from "../../../components/common/Types/Activity";

export default interface RoomDetailProps {
  selectedActivity: Activity;
    onEditActivity: (activity: Activity) => void;
    onDeleteActivity: (activity: Activity) => void;
  }