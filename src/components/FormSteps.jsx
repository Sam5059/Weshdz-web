import styles from './FormSteps.module.css';

export default function FormSteps({ currentStep, steps }) {
  return (
    <div className={styles.stepsContainer}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${styles.step} ${currentStep === index + 1 ? styles.active : ''} ${currentStep > index + 1 ? styles.completed : ''}`}
        >
          <div className={styles.stepNumber}>{index + 1}</div>
          <div className={styles.stepLabel}>{step}</div>
        </div>
      ))}
    </div>
  );
}
