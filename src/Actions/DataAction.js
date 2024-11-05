import axios from 'axios';

export const fetchAllData = () => async (dispatch) => {
    try {
        dispatch({ type: 'DATA_REQUEST' });
    
        const response = await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment/");
        dispatch({ type: 'DATA_SUCCESS', payload: response.data });

    } catch (error) {
        dispatch({ type: 'DATA_FAILURE' });
    }
};

export const selectData = (group, allTickets, orderValue) => async (dispatch) => {
    try {
        dispatch({ type: 'SELECT_DATA_REQUEST' });

        const selectedData = [];
        const mySet = new Set();

        if (group === 'status') {
            allTickets.forEach(ticket => {
                mySet.add(ticket.status);
            });

            const statusArray = Array.from(mySet);

            statusArray.forEach((status, index) => {
                const filteredTickets = allTickets.filter(ticket => ticket.status === status);
                selectedData.push({
                    [index]: {
                        title: status,
                        value: filteredTickets
                    }
                });
            });
        } else if (group === 'user') {
            allTickets.allUser.forEach((user, index) => {
                const userTickets = allTickets.allTickets.filter(ticket => ticket.userId === user.id);
                selectedData.push({
                    [index]: {
                        title: user.name,
                        value: userTickets
                    }
                });
            });
        } else {
            const priorityList = ["No priority", "Low", "Medium", "High", "Urgent"];
            priorityList.forEach((priority, index) => {
                const filteredTickets = allTickets.filter(ticket => ticket.priority === index);
                selectedData.push({
                    [index]: {
                        title: priority,
                        value: filteredTickets
                    }
                });
            });
        }

        if (orderValue === "title") {
            selectedData.forEach((item, index) => {
                item[index]?.value?.sort((a, b) => a.title.localeCompare(b.title));
            });
        } else if (orderValue === "priority") {
            selectedData.forEach((item, index) => {
                item[index]?.value?.sort((a, b) => b.priority - a.priority);
            });
        }

        dispatch({ type: 'SELECT_DATA_SUCCESS', payload: { selectedData, user: group === 'user' } });

    } catch (error) {
        dispatch({ type: 'SELECT_DATA_FAILURE', payload: error.message });
    }
};
