/**
 * @File   : Actor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 08/15/2019, 11:06:01 PM
 * @Description:
 */
import * as Sein from 'seinjs';

/**
 * `TinyProgramHUDSystemActor`的初始化参数类型。
 */
export interface IOptionTypes {}

/**
 * `TinyProgramHUD`的类型接口。
 */
export interface IHUD {
  /**
   * 更新小程序DOM位置的接口。
   * 
   * @param x 屏幕空间的X
   * @param y 屏幕空间的Y
   * @param z 屏幕空间的Z
   */
  updateXYZ(x?: number, y?: number, z?: number): void;
  /**
   * 更新小程序DOM可见性的接口。
   * 
   * @param visible 是否可见
   */
  updateVisible(visible: boolean): void;
  /**
   * 获取小程序DOM尺寸。
   */
  getSize(): {width: number, height: number;}
  /**
   * 链接的Actor或Component。
   */
  getLinkedObject(): Sein.SceneActor | Sein.SceneComponent;
  _preVisible?: boolean;
  _preSize?: {w: number, h: number};
  _prePosition?: Sein.Vector3;
}

/**
 * TinyProgramHUD.Component的一个容器封装，但添加了一些特别的功能使其可以追踪其他Actor。
 * 
 * @template IOption 可进行初始化参数扩展。
 * @template IEvents 可扩展事件类型。
 * @noInheritDoc
 */
@Sein.SClass({className: 'TinyProgramHUDSystemActor'})
export default class SystemActor<IOption extends IOptionTypes = IOptionTypes> extends Sein.SystemActor<IOption> {
  public isTinyProgramHUDSystemActor = true;
  public updatePriority = Sein.InfoActor.UPDATE_PRIORITY.System;

  protected _huds: IHUD[] = [];

  public verifyAdding() {

  }

  public onAdd(options: IOptionTypes) {

  }

  public addHUD(hud: IHUD) {
    const index = this._huds.indexOf(hud);

    if (index < 0) {
      hud._preVisible = false;
      hud._preSize = {w: 0, h: 0};
      hud._prePosition = new Sein.Vector3();
      this._huds.push(hud);
    }
  }

  public removeHUD(hud: IHUD) {
    const index = this._huds.indexOf(hud);

    if (index >= 0) {
      this._huds.splice(index, 1);
    }
  }

  public onUpdate(delta: number) {
    const len = this._huds.length;
    for (let index = 0; index < len; index += 1) {
      const hud = this._huds[index];

      if (hud.getLinkedObject()) {
        this.updateOne(hud);
      }
    }
  }

  protected updateOne(hud: IHUD) {
    const linkedObject = hud.getLinkedObject();
    if (!linkedObject.visible) {
      if (hud._preVisible) {
        hud.updateVisible(false);
      }

      hud._preVisible = false;
      return;
    }

    let component: Sein.SceneComponent;

    if (Sein.isSceneActor(linkedObject)) {
      component = linkedObject.root;
    } else {
      component = linkedObject;
    }

    const {ndcPosition} = component;

    if (!ndcPosition) {
      return;
    }

    const {width, height} = hud.getSize();
    const {w, h} = hud._preSize;

    if (hud._prePosition.equals(ndcPosition) && (width - w <= 0.001) && (height - h <= 0.001)) {
      return;
    }

    hud._preSize.w = width;
    hud._preSize.h = height;

    const {x, y, z} = ndcPosition;

    if (x < -1 || x > 1 || y < -1 || y > 1 || z < -1 || z > 1) {
      if (hud._preVisible) {
        hud.updateVisible(false);
      }

      hud._preVisible = false;
      return;
    }

    const {screenWidth: cWidth, screenHeight: cHeight} = this.getGame();
    if (!hud._preVisible) {
      hud.updateVisible(true);
    }
    hud._preVisible = true;

    const left = (cWidth * (x + 1) - width) / 2;
    const top = (cHeight * (1 - y)) / 2 - height;

    hud.updateXYZ(left, top, 1 - z);

    hud._prePosition.copy(ndcPosition);
  }

  public verifyRemoving() {
    
  }

  public onDestroy() {

  }
}
