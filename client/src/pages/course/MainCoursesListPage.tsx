
import { useState, useEffect } from 'react';

type User = {
    user_login: string,
    user_role: string,
    user_name: string,
    user_surname: string
}

const MainCoursesListPage = () => {
    
    const [users, setUsers] = useState<User[]>([]);

    // let courses = "loading..."

    useEffect(() => {
        async function fetchCourses() {
            const response = await fetch("http://localhost:3000/users");
            const users_json = await response.json();
    
            setUsers(users_json);
            console.log(users_json);
        }
        
        fetchCourses();
    }, []);


    return(
        <div>
            {
                users.map(user => {
                    return <div key={user.user_login}>{user.user_login}, {user.user_role}, {user.user_name}, {user.user_surname}</div>
                })
            }
        </div>
    )
}

export default MainCoursesListPage;