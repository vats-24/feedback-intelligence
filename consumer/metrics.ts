export const metrics = {
  total: 0,
  success: 0,
  failure: 0,
  processingTimes: [] as number[],

  record(time: number) {
    this.processingTimes.push(time);
  },

  avg() {
    if (!this.processingTimes.length) return 0;
    return (
      this.processingTimes.reduce((a, b) => a + b, 0) /
      this.processingTimes.length
    );
  },
};
