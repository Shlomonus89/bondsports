import React from "react";
import {  List } from "@chakra-ui/react";
import { PlayerType } from "../types";
import Player from "./Player";

type Props = {
  players: Array<PlayerType>;
  onClick: (id: number) => void;
  showOnSelect: boolean;
  switchColor?: boolean;

};

export default function PlayersList({ players, onClick, showOnSelect,switchColor }: Props) {
  const listItems = players.map((p) => (
    <Player
      key={p.id}
      selected={p.selected}
      showOnSelect={showOnSelect}
      onClick={() => {
        onClick(p.id);
      }}
    >
      {p.name}
    </Player>
  ));
  return   <List bg={switchColor? 'green.200':'orange'} minW={200} border="2px solid purple" borderRadius="12px" p={4} spacing={3}>{listItems}</List>
}
