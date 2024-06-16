import Badge from "react-bootstrap/Badge";

export const BadgePoint = ({ points }: { points: number }) => {
  const getBgColor = () => {
    switch (points) {
      case 4:
        return "success";
      case 1:
        return "primary";
      case 0:
        return "danger";
    }
  };

  return (
    <Badge pill bg={getBgColor()}>
      {points}
    </Badge>
  );
};
