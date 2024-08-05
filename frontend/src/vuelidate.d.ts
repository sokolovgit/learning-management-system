declare module '@vuelidate/core' {
  import { Ref } from 'vue'

  interface Validation {
    $model: any
    $dirty: boolean
    $error: boolean
    $pending: boolean
    $touch: () => void
    $reset: () => void
    $validate: () => Promise<boolean>
    [key: string]: any
  }

  export function useVuelidate(rules: object, state: Ref<any>, options?: object): Ref<Validation>
}
