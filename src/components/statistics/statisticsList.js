import React from "react";
import {useAllUsersCollection} from "../../hooks";

const StatisticsList = () => {
    const usersData = useAllUsersCollection();

    const rows = usersData.map((element, index) => {
        return (
            <tr key={`users-table-${index}`}>
                <th scope="row">{index + 1}</th>
                <th scope="row">{element.name.first}</th>
                <th scope="row">{element.name.last}</th>
                <th scope="row">{element.publishedPosts}</th>
                <th scope="row">{element.hasDraft ? "Yes" : "No"}</th>
            </tr>
        );
    });

    return (
        <tbody>{rows}</tbody>
    )
};

export default StatisticsList;