import { ListIcon, ListItem } from "@chakra-ui/react";
import {
  ChevronRightIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { PropsWithChildren } from "react";

type Props = {
  onClick: () => void;
  selected: boolean;
  showOnSelect: boolean;
};

function Player({
  onClick,
  selected,
  children,
  showOnSelect,
}: PropsWithChildren<Props>) {
  return (
    <ListItem color='white'>
      {((selected && showOnSelect) || (!selected && !showOnSelect)) && (
        <ListIcon
          onClick={onClick}
          as={selected ? CheckCircleIcon : ChevronRightIcon}
        />
      )}
      {children}
    </ListItem>
  );
}

export default Player;
