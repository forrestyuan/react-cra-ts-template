export enum ACCESS {
  /** 1 << 0 */
  归属审批 = 2 ** 0,
  /** 1 << 1 */
  行权审批 = 2 ** 1,
  /** 1 << 2 */
  交易审批 = 2 ** 2,
  /** 1 << 3 */
  转股审批 = 2 ** 3,
  /** 1 << 4 */
  成员信息导出 = 2 ** 4,
  /** 1 << 5 */
  成员信息重置 = 2 ** 5,
  /** 1 << 6 */
  成员信息删除 = 2 ** 6,
  /** 1 << 7 */
  成员信息编辑 = 2 ** 7,
  /** 1 << 8 */
  上传 = 2 ** 8,
  /** 1 << 9 */
  查看上传列表 = 2 ** 9,
  /** 1 << 10 */
  编辑上传 = 2 ** 10,
  /** 1 << 11 */
  删除上传 = 2 ** 11,
  /** 1 << 12 */
  保存上传 = 2 ** 12,
  /** 1 << 13 */
  编辑自定义 = 2 ** 13,
  /** 1 << 14 */
  归属模式设置 = 2 ** 14,
  /** 1 << 15 */
  计划模板设置 = 2 ** 15,
  /** 1 << 16 */
  任务设置 = 2 ** 16,
  /** 1 << 17 */
  文件库查看 = 2 ** 17,
  /** 1 << 18 */
  文件上传 = 2 ** 18,
  /** 1 << 19 */
  文件删除 = 2 ** 19,
  /** 1 << 20 */
  文件下载 = 2 ** 20,
  /** 1 << 21 */
  管理员权限设置 = 2 ** 21,
  /** 1 << 22 */
  客户权限设置 = 2 ** 22,
  /** 1 << 23 */
  离职处理设置 = 2 ** 23,
  /** 1 << 24 */
  公告发布 = 2 ** 24,
  /** 1 << 25 */
  禁售期设置 = 2 ** 25,
  /** 1 << 26 */
  成员信息报表 = 2 ** 26,
  /** 1 << 27 */
  授予信息报表 = 2 ** 27,
  /** 1 << 28 */
  归属信息报表 = 2 ** 28,
  /** 1 << 29 */
  历史活动报表 = 2 ** 29,
  /** 1 << 30 */
  交易报表 = 2 ** 30,
  /** 1 << 31 */
  税务报表 = 2 ** 31,
  /** 1 << 32 */
  税局上传模板 = 2 ** 32,
  /** 1 << 33 */
  审批详情报表 = 2 ** 33,
  /** 1 << 34 */
  任务详情报表 = 2 ** 34,
  /** 1 << 35 */
  导出管理中心使用 = 2 ** 35,
  /** 1 << 36 */
  交易查看 = 2 ** 36,
  /** 1 << 37 */
  交易结单导出 = 2 ** 37,
  /** 1 << 38 */
  公司信息查看 = 2 ** 38,
  /** 1 << 39 */
  公司信息编辑 = 2 ** 39,
  /** 1 << 40 */
  公司信息添加 = 2 ** 40,
  /** 1 << 41 */
  税务计算 = 2 ** 41,
  /** 1 << 42 */
  绩效结果 = 2 ** 42,
  /** 1 << 43 */
  股价及汇率 = 2 ** 43,
  /** 1 << 44 */
  审批流程 = 2 ** 44,
  /** 1 << 45 */
  归属管理 = 2 ** 45,
  /** 1 << 46 */
  行权管理 = 2 ** 46,
  /** 1 << 47 */
  交易管理 = 2 ** 47,
}

class Bit {
  num: number
  constructor(num: number) {
    this.num = num
  }

  /** 二进制字符串 -> 数字 */
  bitStrToNum(bitStr: string) {
    if (bitStr === '') {
      return 0
    }
    return parseInt(bitStr, 2)
  }

  /** 数字 -> 二进制字符串 */
  numToBitStr(num: number) {
    let val = num.toString(2)
    while (val.length < 32) {
      val = '0' + val
    }
    return val
  }

  /** 二进制字符串 前32位 */
  getHighFromBitStr(bitStr: string) {
    return bitStr.slice(0, -32)
  }

  /** 二进制字符串 后32位 */
  getLowFromBitStr(bitStr: string) {
    return bitStr.slice(-32)
  }

  /** 前32位 + 后32位 */
  getBitStrFromHighAndLow(highBitStr: string, lowBitStr: string) {
    return highBitStr + lowBitStr
  }

  /** 前32位数字 */
  get highNum() {
    return this.bitStrToNum(this.getHighFromBitStr(this.numToBitStr(this.num)))
  }

  /** 后32位数字 */
  get lowNum() {
    return this.bitStrToNum(this.getLowFromBitStr(this.numToBitStr(this.num)))
  }

  and(bit: Bit) {
    return this.bitStrToNum(
      this.getBitStrFromHighAndLow(
        this.numToBitStr(this.highNum & bit.highNum),
        this.numToBitStr(this.lowNum & bit.lowNum),
      ),
    )
  }
}

class AccessService {
  private permission = '' // 40个二进制数 一个16进制数代表4位 所以需要10个16进制数 字符串长度为10

  setPermission(permission: string) {
    this.permission = permission
  }

  checkPermission(permission: string) {
    if (permission === '') {
      return 0
    }
    return parseInt(permission, 16)
  }

  constructor(permission?: string) {
    if (permission) {
      this.setPermission(permission)
    }
  }

  check(accesses: ACCESS[]): boolean
  check(access: ACCESS): boolean
  check(args: ACCESS | ACCESS[]) {
    return this.checkWithPermission(this.permission, args as any)
  }

  checkWithPermission(permission: string, args: ACCESS): boolean
  checkWithPermission(permission: string, args: ACCESS[]): boolean
  checkWithPermission(permission: string, args: ACCESS | ACCESS[]) {
    const test = (access: ACCESS) => {
      const permissionBit = new Bit(parseInt(permission, 16))
      const accessBit = new Bit(access)
      return permissionBit.and(accessBit) === access
    }

    if (typeof args === 'number') {
      const access = args
      return test(access)
    } else {
      const accesses = args
      if (accesses.length === 0) {
        return false
      }
      return accesses.every((access) => test(access))
    }
  }
}
