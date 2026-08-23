import { useEffect, useState } from "react";
import API from "../services/api";

import {
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from "@mui/material";

export default function AuthorizedPersons() {

    const [people, setPeople] = useState([]);

    const [name, setName] = useState("");

    const [personId, setPersonId] = useState("");


    const loadPeople = async () => {

        try {

            const response =
                await API.get("/authorized/");

            setPeople(response.data);

        } catch (error) {

            console.error(
                "Unable to load authorized people",
                error
            );

        }

    };


    useEffect(() => {

        loadPeople();

    }, []);


    const addPerson = async () => {

        if (!name || !personId) {

            alert(
                "Enter name and person ID"
            );

            return;

        }


        try {

            await API.post(
                "/authorized/",
                {
                    name,
                    person_id: personId,
                    authorized: true
                }
            );


            setName("");

            setPersonId("");

            loadPeople();


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed to add person"
            );

        }

    };


    const toggleAuthorization =
        async (person) => {

        try {

            await API.put(
                `/authorized/${person.id}`,
                null,
                {
                    params: {
                        authorized:
                            !person.authorized
                    }
                }
            );

            loadPeople();

        } catch (error) {

            console.error(error);

        }

    };


    const deletePerson =
        async (id) => {

        if (
            !window.confirm(
                "Delete this person?"
            )
        ) {

            return;

        }


        try {

            await API.delete(
                `/authorized/${id}`
            );

            loadPeople();

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <Container sx={{ mt: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                👤 Authorized Persons
            </Typography>


            <Card
                sx={{
                    mt: 3,
                    borderRadius: 3
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Add Person
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <TextField
                            label="Person Name"
                            value={name}
                            onChange={
                                e =>
                                    setName(
                                        e.target.value
                                    )
                            }
                        />


                        <TextField
                            label="Employee / Person ID"
                            value={personId}
                            onChange={
                                e =>
                                    setPersonId(
                                        e.target.value
                                    )
                            }
                        />


                        <Button
                            variant="contained"
                            onClick={addPerson}
                        >
                            Add Authorized Person
                        </Button>

                    </Box>

                </CardContent>

            </Card>


            <Card
                sx={{
                    mt: 3,
                    borderRadius: 3
                }}
            >

                <CardContent>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    Name
                                </TableCell>

                                <TableCell>
                                    Person ID
                                </TableCell>

                                <TableCell>
                                    Status
                                </TableCell>

                                <TableCell>
                                    Action
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            {people.map(
                                person => (

                                <TableRow
                                    key={person.id}
                                >

                                    <TableCell>
                                        {person.name}
                                    </TableCell>


                                    <TableCell>
                                        {person.person_id}
                                    </TableCell>


                                    <TableCell>

                                        <Chip
                                            label={
                                                person.authorized
                                                    ? "AUTHORIZED"
                                                    : "UNAUTHORIZED"
                                            }
                                            color={
                                                person.authorized
                                                    ? "success"
                                                    : "error"
                                            }
                                        />

                                    </TableCell>


                                    <TableCell>

                                        <Button
                                            onClick={() =>
                                                toggleAuthorization(
                                                    person
                                                )
                                            }
                                        >
                                            Toggle
                                        </Button>


                                        <Button
                                            color="error"
                                            onClick={() =>
                                                deletePerson(
                                                    person.id
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </CardContent>

            </Card>

        </Container>

    );
}