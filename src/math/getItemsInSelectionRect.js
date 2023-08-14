import { itemList, mySketch as p } from "../app";

export default function getItemsInSelectionRect(_startX, _startY, _endX, _endY) {
  let sItems = [];
  itemList.forEach(function (_item) {
    let corners = [
      [_item.x + _item.swidth / 2 * p.cos(_item.angle) - _item.sheight / 2 * p.sin(_item.angle),
      _item.y + _item.swidth / 2 * p.sin(_item.angle) + _item.sheight / 2 * p.cos(_item.angle)],
      [_item.x - _item.swidth / 2 * p.cos(_item.angle) - _item.sheight / 2 * p.sin(_item.angle),
      _item.y - _item.swidth / 2 * p.sin(_item.angle) + _item.sheight / 2 * p.cos(_item.angle)],
      [_item.x + _item.swidth / 2 * p.cos(_item.angle) + _item.sheight / 2 * p.sin(_item.angle),
      _item.y + _item.swidth / 2 * p.sin(_item.angle) - _item.sheight / 2 * p.cos(_item.angle)],
      [_item.x - _item.swidth / 2 * p.cos(_item.angle) + _item.sheight / 2 * p.sin(_item.angle),
      _item.y - _item.swidth / 2 * p.sin(_item.angle) - _item.sheight / 2 * p.cos(_item.angle)]
    ];
    // Check if all corners of the _item are inside the selection rectangle
    const allCornersInside = corners.every(([cornerX, cornerY]) =>
      p.min(_startX, _endX) <= cornerX && cornerX <= p.max(_startX, _endX) &&
      p.min(_startY, _endY) <= cornerY && cornerY <= p.max(_startY, _endY)
    );
    if (allCornersInside) {
      sItems.push(_item);
    }
  });
  return sItems;
}
