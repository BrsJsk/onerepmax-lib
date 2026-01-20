import { WorkoutHistory } from './workout-history';

export class Workout {
  private _name: string = '';
  private _history: WorkoutHistory = new WorkoutHistory();

  set name(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get workoutHistory(): WorkoutHistory {
    return this._history;
  }
}
