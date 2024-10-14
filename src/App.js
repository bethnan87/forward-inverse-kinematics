import React, { useState, useEffect, useRef } from "react";
import "./styles.css"; // Make sure to create this file for custom styles

const KinematicsVisualization = () => {
  const [theta1, setTheta1] = useState(45);
  const [theta2, setTheta2] = useState(45);
  const [targetX, setTargetX] = useState(10);
  const [targetY, setTargetY] = useState(10);
  const [L1, setL1] = useState(10);
  const [L2, setL2] = useState(8);
  const [endEffectorPosition, setEndEffectorPosition] = useState({
    x: 0,
    y: 0,
  });
  const [calculatedAngles, setCalculatedAngles] = useState({
    theta1: 0,
    theta2: 0,
  });

  const canvasRef = useRef(null);

  const forwardKinematics = (theta1, theta2, L1, L2) => {
    const x = L1 * Math.cos(theta1) + L2 * Math.cos(theta1 + theta2);
    const y = L1 * Math.sin(theta1) + L2 * Math.sin(theta1 + theta2);
    return [x, y];
  };

  const inverseKinematics = (x, y, L1, L2) => {
    const cos_theta2 = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const theta2 = Math.acos(Math.max(-1, Math.min(1, cos_theta2)));
    const theta1 =
      Math.atan2(y, x) -
      Math.atan2(L2 * Math.sin(theta2), L1 + L2 * Math.cos(theta2));
    return [theta1, theta2];
  };

  const drawArm = (ctx, x1, y1, x2, y2, color) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 10;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw coordinate system
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
    ctx.strokeStyle = "lightgray";
    ctx.stroke();

    // Forward Kinematics
    const [endX, endY] = forwardKinematics(
      (theta1 * Math.PI) / 180,
      (theta2 * Math.PI) / 180,
      L1,
      L2
    );
    const joint2X = L1 * Math.cos((theta1 * Math.PI) / 180);
    const joint2Y = L1 * Math.sin((theta1 * Math.PI) / 180);

    drawArm(
      ctx,
      offsetX,
      offsetY,
      offsetX + joint2X * scale,
      offsetY - joint2Y * scale,
      "blue"
    );
    drawArm(
      ctx,
      offsetX + joint2X * scale,
      offsetY - joint2Y * scale,
      offsetX + endX * scale,
      offsetY - endY * scale,
      "red"
    );

    // Update end effector position
    setEndEffectorPosition({ x: endX.toFixed(2), y: endY.toFixed(2) });

    // Inverse Kinematics
    const [ikTheta1, ikTheta2] = inverseKinematics(targetX, targetY, L1, L2);
    const [ikEndX, ikEndY] = forwardKinematics(ikTheta1, ikTheta2, L1, L2);
    const ikJoint2X = L1 * Math.cos(ikTheta1);
    const ikJoint2Y = L1 * Math.sin(ikTheta1);

    drawArm(
      ctx,
      offsetX,
      offsetY,
      offsetX + ikJoint2X * scale,
      offsetY - ikJoint2Y * scale,
      "green"
    );
    drawArm(
      ctx,
      offsetX + ikJoint2X * scale,
      offsetY - ikJoint2Y * scale,
      offsetX + ikEndX * scale,
      offsetY - ikEndY * scale,
      "purple"
    );

    // Update calculated angles
    setCalculatedAngles({
      theta1: ((ikTheta1 * 180) / Math.PI).toFixed(2),
      theta2: ((ikTheta2 * 180) / Math.PI).toFixed(2),
    });

    // Draw target point
    ctx.beginPath();
    ctx.arc(
      offsetX + targetX * scale,
      offsetY - targetY * scale,
      3,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "red";
    ctx.fill();
  }, [theta1, theta2, targetX, targetY, L1, L2]);

  return (
    <div className="container">
      <h1 className="title">Kinematics Visualization</h1>
      <div className="flex-container">
        <div className="canvas-container">
          <canvas ref={canvasRef} width={400} height={400} className="canvas" />
        </div>
        <div className="controls-container">
          <div className="card">
            <h2>Forward Kinematics</h2>
            <div className="slider-container">
              <label>θ1: {theta1}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={theta1}
                onChange={(e) => setTheta1(Number(e.target.value))}
              />
            </div>
            <div className="slider-container">
              <label>θ2: {theta2}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={theta2}
                onChange={(e) => setTheta2(Number(e.target.value))}
              />
            </div>
            <div className="result">
              <strong>End Effector Position:</strong>
              <p>
                X: {endEffectorPosition.x}, Y: {endEffectorPosition.y}
              </p>
            </div>
          </div>

          <div className="card">
            <h2>Inverse Kinematics</h2>
            <div className="slider-container">
              <label>Target X: {targetX}</label>
              <input
                type="range"
                min="-18"
                max="18"
                step="0.1"
                value={targetX}
                onChange={(e) => setTargetX(Number(e.target.value))}
              />
            </div>
            <div className="slider-container">
              <label>Target Y: {targetY}</label>
              <input
                type="range"
                min="-18"
                max="18"
                step="0.1"
                value={targetY}
                onChange={(e) => setTargetY(Number(e.target.value))}
              />
            </div>
            <div className="result">
              <strong>Calculated Angles:</strong>
              <p>
                θ1: {calculatedAngles.theta1}°, θ2: {calculatedAngles.theta2}°
              </p>
            </div>
          </div>

          <div className="card">
            <h2>Arm Lengths</h2>
            <div className="slider-container">
              <label>L1: {L1}</label>
              <input
                type="range"
                min="1"
                max="18"
                step="0.1"
                value={L1}
                onChange={(e) => setL1(Number(e.target.value))}
              />
            </div>
            <div className="slider-container">
              <label>L2: {L2}</label>
              <input
                type="range"
                min="1"
                max="18"
                step="0.1"
                value={L2}
                onChange={(e) => setL2(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KinematicsVisualization;
