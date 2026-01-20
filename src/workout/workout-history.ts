import { v4 as uuidv4 } from 'uuid';

export interface IWorkoutHistory {
  id?: string;
  weightUnit: 'kg' | 'lb';
  weight: number;
  repetitions?: number;
  onerepmax?: number;
  date?: Date;
  notes?: string;
}

export class WorkoutHistory {
  private workouts: IWorkoutHistory[] = [];

  private validateWorkout(workout: IWorkoutHistory): void {
    if (typeof workout.weight !== 'number' || workout.weight <= 0) {
      throw new Error('Weight must be a positive number');
    }
    if (
      workout.repetitions !== undefined &&
      (typeof workout.repetitions !== 'number' || workout.repetitions <= 0)
    ) {
      throw new Error('Repetitions must be a positive number if provided');
    }

    if (workout.onerepmax !== undefined) {
      throw new Error(
        'onerepmax should not be set manually; it is calculated automatically',
      );
    }
  }

  private calculateOneRepMax(weight: number, repetitions: number = 1): number {
    return Math.round(weight * (1 + repetitions / 30));
  }

  addWorkout(workout: Omit<IWorkoutHistory, 'onerepmax'>): void {
    this.validateWorkout(workout as IWorkoutHistory);

    const workoutWithOneRepMax: IWorkoutHistory = {
      ...workout,
      id: uuidv4(),
      date: new Date(),
      onerepmax: this.calculateOneRepMax(workout.weight, workout.repetitions),
    };

    this.workouts.push(workoutWithOneRepMax);
  }

  getWorkouts(): IWorkoutHistory[] {
    return JSON.parse(JSON.stringify(this.workouts));
  }

  deleteWorkout(id: string): boolean {
    const initialLength = this.workouts.length;
    this.workouts = this.workouts.filter((workout) => workout.id !== id);
    return this.workouts.length < initialLength;
  }

  editWorkout(
    id: string,
    updatedWorkout: Partial<Omit<IWorkoutHistory, 'onerepmax'>>,
  ): boolean {
    const workoutIndex = this.workouts.findIndex(
      (workout) => workout.id === id,
    );
    if (workoutIndex === -1) {
      return false;
    }

    const merged = {
      ...this.workouts[workoutIndex],
      ...updatedWorkout,
    };

    // Validate updated fields
    if (merged.weight !== undefined && merged.weight <= 0) {
      throw new Error('Weight must be a positive number');
    }
    if (merged.repetitions !== undefined && merged.repetitions <= 0) {
      throw new Error('Repetitions must be a positive number');
    }

    // Recalculate onerepmax if weight or repetitions changed
    merged.onerepmax = this.calculateOneRepMax(
      merged.weight,
      merged.repetitions,
    );

    this.workouts[workoutIndex] = merged;
    return true;
  }
}
