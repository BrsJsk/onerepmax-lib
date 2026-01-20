import { describe, it, expect } from 'vitest';
import { Workout } from '../src/workout/workout';

describe('Workout', () => {
  const workout = new Workout();

  it('sets and gets name', () => {
    workout.name = 'Bench Press';
    expect(workout.name).toBe('Bench Press');
  });

  it('adds a workout to history', () => {
    const workoutEntry = {
      weightUnit: 'kg' as const,
      repetitions: 10,
      weight: 100,
    };
    workout.workoutHistory.addWorkout(workoutEntry);
    const history = workout.workoutHistory.getWorkouts();
    expect(history.length).toBe(1);
    expect(history[0].weight).toEqual(workoutEntry.weight);
    expect(history[0].onerepmax).toBe(133);
  });

  it('edits a workout in history', () => {
    const history = workout.workoutHistory.getWorkouts();

    const updatedWorkout = {
      id: history[0].id,
      weightUnit: 'kg' as const,
      repetitions: 10,
      weight: 110,
    };

    workout.workoutHistory.editWorkout(history[0].id!, updatedWorkout);

    const updatedHistory = workout.workoutHistory.getWorkouts();
    expect(updatedHistory.length).toBe(1);
    expect(updatedHistory[0].weight).toEqual(updatedWorkout.weight);
    expect(updatedHistory[0].onerepmax).toBe(147);
  });

  it('deletes a workout from history', () => {
    const history = workout.workoutHistory.getWorkouts();

    workout.workoutHistory.deleteWorkout(history[0].id!);
    expect(workout.workoutHistory.getWorkouts().length).toBe(0);
  });
});
