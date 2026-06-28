import Badge from "react-bootstrap/Badge";

export const BadgePoint = ({ points }: { points: number }) => {
  const getBgColor = () => {
    if (points > 2) return "success";
    if (points === 1 || points === 2) return "primary";
    if (points === 0) return "danger";
    return "secondary";
  };

  return (
    <Badge pill bg={getBgColor()}>
      {points}
    </Badge>
  );
};
