import { useState, useEffect } from "react";
import User from "../../components/common/Types/User";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import Room from "../../components/common/Types/Room";
import RoomDetail from "./RoomListComponents/RoomDetail";

const RoomListPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const authHeader = useAuthHeader();
    const dispatch = useDispatch();

    useEffect(() => {
    fetchRooms();
    }, []);

    async function fetchRooms() {
    try {
        dispatch(setLoadingContentState(true));
        const response = await fetch("http://localhost:3000/rooms", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
        },
        });
        const json_users = await response.json();
        setRooms(json_users.filter((room: Room) => room.id !== null));
        dispatch(setLoadingContentState(false));
    } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(setLoadingContentState(false));
    }
    }

    const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    };

    const handleDeleteRoom = (toBeDeletedUser: Room) => {  
        const deleteRoom = async () => {
            try {
            dispatch(setLoadingContentState(true));
            await fetch(
                "http://localhost:3000/rooms/" + toBeDeletedUser.id,
                {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    authorization: authHeader(),
                },
                }
            );

            // call fetch users after deleting user
            fetchRooms();
            dispatch(setLoadingContentState(false));
            } catch (error) {
            dispatch(setLoadingContentState(false));
            console.error("Error deleting user:", error);
            }
        };
        deleteRoom();
    }

    const handleEditRoom = (editedRoom: Room) => {  
    const toBeUpdatedRoom = {
        building: editedRoom.building,
        floor: editedRoom.floor,
        number: editedRoom.number,
        capacity: editedRoom.capacity,
    };

    const updateRoom = async () => {
        try {
        dispatch(setLoadingContentState(true));
        await fetch(
            "http://localhost:3000/rooms/" + editedRoom.id,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: authHeader(),
            },
            body: JSON.stringify(toBeUpdatedRoom),
            }
        );

        // call fetch rooms after update room
        fetchRooms();
        dispatch(setLoadingContentState(false));
        } catch (error) {
        console.error("Error updating room:", error);
        dispatch(setLoadingContentState(false));
        }
    };

    updateRoom();
    };

    return (
        <div className="rooms-page">
          <div className="list-pages-list-container">
            <h2>Seznam Místností</h2>
            <ul>
              <li className="list-header">
                <span className="header-item">ID</span>
                <span className="header-item">Budova</span>
                <span className="header-item">Patro</span>
                <span className="header-item">Číslo Místnost</span>
                <span className="header-item">Kapacita Místnost</span>
              </li>
              {rooms.map((room: Room) => (
                <li
                  key={room.id}
                  className="list-item-properties"
                  onClick={() => handleRoomClick(room)}
                >
                  <span className="list-item-property">{room.id}</span>
                  <span className="list-item-property">{room.building}</span>
                  <span className="list-item-property">{room.floor}</span>
                  <span className="list-item-property">{room.number}</span>
                  <span className="list-item-property">{room.capacity}</span>
                </li>
              ))}
            </ul>
          </div>
          {selectedRoom && (
            <RoomDetail
            selectedRoom={selectedRoom}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
            />
          )}
        </div>
      );
}

export default RoomListPage;