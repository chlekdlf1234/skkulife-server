export default class DeleteKeyHelper {
  public static deleteKey(object: any) {
    delete object.PK;
    delete object.SK;

    return object;
  }

  public static deleteKeys(array: any[]) {
    for (let i = 0; i < array.length; i++) {
      delete array[i].PK;
      delete array[i].SK;
    }

    return array;
  }
}
