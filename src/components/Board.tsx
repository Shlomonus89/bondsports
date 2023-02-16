import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  VStack,
} from "@chakra-ui/react";
import Axios from "axios";
import { PlayerType, PlayerFromApiType } from "../types";
import PlayersList from "./PlayersList";
import cloneDeep from "lodash.clonedeep";

export default function Board() {
  const [playerListData, setPlayerListData] = useState<PlayerType[]>([]);
  const inputRef = useRef("");
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritePlayers, setFavoritePlayers] = useState<PlayerType[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const switchHandler = () => {
    setIsChecked(!isChecked);
  };
  const getPlayers = useCallback(async () => {
    const { data: PlayersInfo } = await Axios.get<PlayerFromApiType>(
      "https://www.balldontlie.io/api/v1/players",
      {
        params: {
          search: searchTerm,
        },
      }
    );

    let players = PlayersInfo.data.map((externalPlayer) => ({
      name: `${externalPlayer.first_name} ${externalPlayer.last_name}`,
      selected: false,
      id: externalPlayer.id,
    }));

    if (favoritePlayers.length > 0) {
      players = players.map((p) => {
        if (favoritePlayers.some((fp) => fp.name === p.name)) {
          p.selected = true;
          return p;
        }
        return p;
      });
    }

    setPlayerListData(players);
  }, [favoritePlayers, searchTerm]);

  useEffect(() => {
    getPlayers();
  }, [searchTerm, getPlayers]);

  function selectFavoritePlayer(id: number) {
    const clone = cloneDeep(playerListData);
    const index = clone.findIndex((p) => p.id === id);

    clone[index].selected = true;

    setFavoritePlayers([...favoritePlayers, clone[index]]);
  }

  function unselectFavoritePlayer(id: number) {
    const clone = cloneDeep(favoritePlayers);
    const fpIndex = clone.findIndex((p) => p.id === id);

    const indexOfFpInPlayerListData = playerListData.findIndex(
      (p) => p.id === favoritePlayers[fpIndex].id
    );
    if (indexOfFpInPlayerListData !== -1) {
      const playerListDataClone = cloneDeep(playerListData);
      playerListDataClone[indexOfFpInPlayerListData].selected = false;
      setPlayerListData(playerListDataClone);
    }
    clone.splice(fpIndex, 1);

    setFavoritePlayers(clone);
  }

  return (
    <VStack align="flex-start" pl={4} pt={4} bg="orange.200" minH="100vh">
      <HStack>
        <InputGroup size="sm">
          <Input
            type="text"
            placeholder="Please enter"
            onChange={(e) => (inputRef.current = e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setSearchTerm(inputRef.current)}
            >
              Search
            </Button>
          </InputRightElement>
        </InputGroup>

        <Switch
          isChecked={isChecked}
          onChange={switchHandler}
          colorScheme="green"
        />
      </HStack>
      <HStack alignItems="flex-start">
        <VStack>
          <PlayersList
            onClick={selectFavoritePlayer}
            players={playerListData}
            showOnSelect={false}
          />
        </VStack>
        <VStack>
          <PlayersList
            onClick={unselectFavoritePlayer}
            players={favoritePlayers}
            showOnSelect={true}
            switchColor={isChecked}
          />
        </VStack>
      </HStack>
    </VStack>
  );
}
