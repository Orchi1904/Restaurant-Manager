import React, { useEffect, useState } from 'react';
import GroupCard from '../components/GroupCard/GroupCard';
import InputField from '../components/InputField/InputField';
import styles from './Home.module.css';
import sushi from '../assets/sushi.svg';

function Home() {
    const [groupName, setGroupName] = useState("");
    const [numberOfPersons, setNumberOfPersons] = useState("");
    const [numberOfSeats, setNumberOfSeats] = useState("");
    const [groups, setGroups] = useState([]);
    const [showNumberOfSeatsContainer, setShowNumberOfSeatsContainer] = useState(true);
    const [seatsArr, setSeatsArr] = useState([]);

    const initSeatsArr = () => {
        if (numberOfSeats <= 0) {
            alert("Anzahl der Sitze muss größer als 0 sein!");
            return;
        }
        //By default every seat is empty -> true
        setSeatsArr(new Array(numberOfSeats).fill(true));
        setShowNumberOfSeatsContainer(false);
    }

    function placeGroup() {
        if (numberOfPersons > seatsArr.filter((seat) => seat).length) {
            alert("Nicht genügend freie Plätze!");
            return;
        }

        const [firstSeat, lastSeat] = findConsecutiveSeats(numberOfPersons);

        if (firstSeat === null || lastSeat === null) {
            alert("Nicht genügend aufeinanderfolgende Plätze vorhanden!");
            return;
        }

        //Mark seats as occupied (false)
        const seatsArrCpy = [...seatsArr];
        for (let i = 0; i < numberOfPersons; i++) {
            //-1 because of Array Index 
            //%seatsArrCpy.length to continue with 0 when Array out of bounds
            const seatIndex = (firstSeat - 1 + i) % seatsArrCpy.length;
            seatsArrCpy[seatIndex] = false;
        }
        setSeatsArr(seatsArrCpy);

        setGroups((prevGroups) => [...prevGroups, { name: groupName, firstSeat, lastSeat, numberOfPersons }]);
        setGroupName("");
        setNumberOfPersons("");
    }

    function findConsecutiveSeats(numberOfPersons) {
        let firstSeat = null;
        let lastSeat = null;

        if (groups.length === 0) {
            firstSeat = 1;
            lastSeat = numberOfPersons;
            return [firstSeat, lastSeat];
        }

        if (groups.length === 1) {
            firstSeat = (groups[0].lastSeat + 1);
            lastSeat = (firstSeat + numberOfPersons - 1);
            //If seat number is bigger than numberOfSeats, use %numberOfSeats so the seat number starts from the beginning
            firstSeat = firstSeat > numberOfSeats ? firstSeat % numberOfSeats : firstSeat;
            lastSeat = lastSeat > numberOfSeats ? lastSeat % numberOfSeats : lastSeat;
            return [firstSeat, lastSeat];
        }

        const groupsSortedByLastSeat = [...groups].sort((a, b) => a.lastSeat - b.lastSeat);
        //Used to compare the last group with the first group again (round table)
        groupsSortedByLastSeat.push(groupsSortedByLastSeat[0]);

        let smallestGap = Number.MAX_SAFE_INTEGER;
        let availableSeats = -1;

        //Find the gap with the smallest number of consecutive seats for the new group
        for (let i = 0; i < groupsSortedByLastSeat.length - 1; i++) {
            const currentGroup = groupsSortedByLastSeat[i];
            const nextGroup = groupsSortedByLastSeat[i + 1];

            if (currentGroup.lastSeat > nextGroup.firstSeat) {
                availableSeats = -1 * (currentGroup.lastSeat - (nextGroup.firstSeat + numberOfSeats) + 1);
            } else {
                availableSeats = -1 * (currentGroup.lastSeat - nextGroup.firstSeat + 1);
            }

            if (availableSeats >= numberOfPersons && availableSeats < smallestGap) {
                firstSeat = (currentGroup.lastSeat + 1);
                lastSeat = (firstSeat + numberOfPersons - 1);
                //If seat number is bigger than numberOfSeats, use %numberOfSeats so the seat number starts from the beginning
                firstSeat = firstSeat > numberOfSeats ? firstSeat % numberOfSeats : firstSeat;
                lastSeat = lastSeat > numberOfSeats ? lastSeat % numberOfSeats : lastSeat;
                smallestGap = availableSeats;
            }
        }

        return [firstSeat, lastSeat];
    }

    const handleAddGroup = (e) => {
        e.preventDefault();

        if (showNumberOfSeatsContainer) {
            alert("Zuerst Anzahl der Sitzplätze bestätigen!");
            return;
        }

        if (groupName.length === 0 || numberOfPersons <= 0) {
            alert("Alle Felder müssen ausgefüllt sein!");
            return;
        }

        if (groups.some(group => group.name === groupName)) {
            alert("Gruppenname bereits vergeben!");
            return;
        }

        placeGroup();
    }

    const handleDeleteGroup = (e, name) => {
        e.preventDefault();

        const groupToDelete = groups.filter(group => group.name === name)[0];
        const seatsArrCpy = [...seatsArr];
        for (let i = 0; i < groupToDelete.numberOfPersons; i++) {
            //-1 because of Array Index, %seatsArrCpy.length to continue with 0 when Array out of bounds
            const seatIndex = (groupToDelete.firstSeat - 1 + i) % seatsArrCpy.length;
            seatsArrCpy[seatIndex] = true;
        }
        setSeatsArr(seatsArrCpy);
    
        setGroups((prevGroups) => prevGroups.filter(group => group.name !== name));
    }

    return (
        <div className={styles.home}>
            <div className={styles.headerContainer}>
                <img className={styles.headerImg} src={sushi} alt="Restaurant Manager Logo" />
                <h1 className={styles.header}>Restaurant Manager</h1>
            </div>
            <form>
                {showNumberOfSeatsContainer &&
                    <div className={styles.numberOfSeatsContainer}>
                        <InputField id="numberOfSeats" labelText="Anzahl der Sitze:" type="number"
                            placeholder="Anzahl der Sitze" value={numberOfSeats}
                            onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                        />
                        <button className={styles.numberOfSeatsButton} onClick={initSeatsArr}>Bestätigen</button>
                    </div>
                }
                <InputField id="groupName" labelText="Name der Gruppe:" type="text"
                    placeholder="Name der Gruppe" value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <InputField id="numberOfPersons" labelText="Anzahl der Personen:" type="number"
                    placeholder="Anzahl der Personen" value={numberOfPersons}
                    onChange={(e) => setNumberOfPersons(parseInt(e.target.value))}
                />
                <button type="submit" className={styles.addGroupBtn}
                    onClick={(e) => handleAddGroup(e)}>Hinzufügen</button>
            </form>
            {!showNumberOfSeatsContainer &&
                <div className={styles.displayNumberOfSeats}>
                    <p>Der Tisch hat {numberOfSeats} Stühle</p>
                </div>
            }
            <div className={styles.headlines}>
                <h4 className={styles.headlineName}>Gruppenname</h4>
                <h4 className={styles.headlinePersons}>Plätze</h4>
            </div>
            <div className={styles.groupCards}>
                {groups.map((group, index) => (
                    <GroupCard key={index} name={group.name} firstSeat={group.firstSeat}
                        lastSeat={group.lastSeat} onDeleteClick={handleDeleteGroup} />
                ))}
            </div>
        </div >
    )
}

export default Home;