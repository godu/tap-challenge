import * as React from 'react';
import { COLOR, colorToHex } from '../domain';

const Button = ({ color, onTap }: { color: string, onTap: () => void }) => (
  <input
    type="button"
    style={{
      backgroundColor: color,
      padding: 0,
      margin: 0,
      width: 100,
      height: 100,
    }}
    onClick={onTap}
  />
);

export const App = ({
  answers,
  onTapYellow,
  onTapBlue,
  onTapGreen,
  onTapRed,
  onReset
}: {
  answers: COLOR[],
  onTapYellow: () => void,
  onTapBlue: () => void,
  onTapGreen: () => void,
  onTapRed: () => void,
  onReset: () => void,
}) => (
    <div>
      <div style={{ display: "flex" }}>
        <input type="button" value="Reset" onClick={onReset} />
      </div>
      <div style={{ display: "flex" }}>
        <Button color="blue" onTap={onTapBlue} />
        <Button color="green" onTap={onTapGreen} />
        <Button color="red" onTap={onTapRed} />
        <Button color="yellow" onTap={onTapYellow} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {[...answers].reverse().map((answer, i) => (
          <span
            key={i}
            style={{
              backgroundColor: colorToHex(answer),
              padding: 0,
              margin: 0,
              width: 20,
              height: 20,
            }}
          />
        )).reverse()}
      </div>
    </div>
  )
