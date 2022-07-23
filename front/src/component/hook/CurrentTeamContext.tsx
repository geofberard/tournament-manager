import * as React from "react";
import {
    FC, PropsWithChildren, useContext, useEffect, useState,
} from "react";
import { Team } from "../../data/Team";
import * as TeamService from "../../service/TeamService";

interface CurrentTeamManager {
    currentTeam: Team;
    setCurrentTeam: (team: Team) => void;
}

const CurrentTeamContext: React.Context<CurrentTeamManager> = React.createContext(undefined);

export const CurrentTeamProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentTeam, setCurrentTeam] = useState<Team>();

    const setCurrentTeamAndPersist = (team: Team) => {
        setCurrentTeam(team);
        TeamService.setCurrentTeam(team);
    };

    useEffect(() => { 
        TeamService.getCurrentTeam()
        .then(setCurrentTeam)
        .catch(error => {
            console.log(error)
            setCurrentTeam(undefined)
        }) 
    }, []);

    return (
        <CurrentTeamContext.Provider value={{ currentTeam, setCurrentTeam: setCurrentTeamAndPersist }}>
            {children}
        </CurrentTeamContext.Provider>
    );
};

export const useCurrentTeam: () => [Team, (team: Team) => void] = () => {
    const manager = useContext(CurrentTeamContext);

    return [manager.currentTeam, manager.setCurrentTeam];
};
