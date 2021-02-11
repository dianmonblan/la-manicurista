export abstract class AbstractModel<T> {
  /**
   * Scenarios for different behaviors of the instance,
   * for example: Validations.
   */
  public scenario: string;

  constructor(data?: T | Object) {
    if (data) this.setData(data);
  }

  public setData(data: T | Object): void {
    Object.assign(this, <Object>data);
  }
}
