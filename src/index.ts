/**
 * @File   : TinyProgramHUDActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018/9/25 上午11:58:00
 * @Description:
 */
import * as Sein from 'seinjs';

import HUDSystemActor, {IOptionTypes as IHUDOptionTypes, IHUD as IHUDHUD} from './SystemActor';

declare module 'seinjs' {
  export namespace TinyProgramHUD {
    export interface IHUD extends IHUDHUD {}
    export interface IOptionTypes extends IHUDOptionTypes {}
    export class SystemActor<IOptions extends IOptionTypes = IOptionTypes> extends HUDSystemActor<IOptions> {}
    export function isSystemActor(value: Sein.SObject): value is SystemActor;
  }
}

/**
 * 判断一个实例是否为`TinyProgramHUDSystemActor`。
 */
function isSystemActor(value: Sein.SObject): value is HUDSystemActor {
  return (value as HUDSystemActor).isTinyProgramHUDSystemActor;
}


(Sein as any).TinyProgramHUD = {
  SystemActor: HUDSystemActor,
  isSystemActor
};

export {
  HUDSystemActor as SystemActor,
  isSystemActor,
  IHUDOptionTypes as IOptionTypes,
  IHUDHUD as IHUD
};
