export interface DisplayComponent {
  /**
   * Fetch the data of the currently displayed model
   */
  getById(id: number | string): void;
}
