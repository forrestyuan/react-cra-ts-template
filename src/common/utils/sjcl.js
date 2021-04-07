/* eslint-disable */
'use strict'

// ie crypto polyfill
if (!window.crypto) {
  window.crypto = {
    getRandomValues: function (array) {
      var l = array.length
      for (var i = 0; i < l; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    },
  }
}

function q(a) {
  throw a
}
var s = void 0,
  t = !1
var sjcl = {
  cipher: {},
  hash: {},
  keyexchange: {},
  mode: {},
  misc: {},
  codec: {},
  exception: {
    corrupt: function (a) {
      this.toString = function () {
        return 'CORRUPT: ' + this.message
      }
      this.message = a
    },
    invalid: function (a) {
      this.toString = function () {
        return 'INVALID: ' + this.message
      }
      this.message = a
    },
    bug: function (a) {
      this.toString = function () {
        return 'BUG: ' + this.message
      }
      this.message = a
    },
    notReady: function (a) {
      this.toString = function () {
        return 'NOT READY: ' + this.message
      }
      this.message = a
    },
  },
}
'undefined' !== typeof module && module.exports && (module.exports = sjcl)
'function' === typeof define &&
  define([], function () {
    return sjcl
  })
sjcl.cipher.aes = function (a) {
  this.l[0][0][0] || this.F()
  var b,
    c,
    d,
    e,
    g = this.l[0][4],
    f = this.l[1]
  b = a.length
  var h = 1
  4 !== b &&
    6 !== b &&
    8 !== b &&
    q(new sjcl.exception.invalid('invalid aes key size'))
  this.b = [(d = a.slice(0)), (e = [])]
  for (a = b; a < 4 * b + 28; a++) {
    c = d[a - 1]
    if (0 === a % b || (8 === b && 4 === a % b))
      (c =
        (g[c >>> 24] << 24) ^
        (g[(c >> 16) & 255] << 16) ^
        (g[(c >> 8) & 255] << 8) ^
        g[c & 255]),
        0 === a % b &&
          ((c = (c << 8) ^ (c >>> 24) ^ (h << 24)),
          (h = (h << 1) ^ (283 * (h >> 7))))
    d[a] = d[a - b] ^ c
  }
  for (b = 0; a; b++, a--)
    (c = d[b & 3 ? a : a - 4]),
      (e[b] =
        4 >= a || 4 > b
          ? c
          : f[0][g[c >>> 24]] ^
            f[1][g[(c >> 16) & 255]] ^
            f[2][g[(c >> 8) & 255]] ^
            f[3][g[c & 255]])
}
sjcl.cipher.aes.prototype = {
  encrypt: function (a) {
    return w(this, a, 0)
  },
  decrypt: function (a) {
    return w(this, a, 1)
  },
  l: [
    [[], [], [], [], []],
    [[], [], [], [], []],
  ],
  F: function () {
    var a = this.l[0],
      b = this.l[1],
      c = a[4],
      d = b[4],
      e,
      g,
      f,
      h = [],
      k = [],
      l,
      n,
      m,
      p
    for (e = 0; 0x100 > e; e++) k[(h[e] = (e << 1) ^ (283 * (e >> 7))) ^ e] = e
    for (g = f = 0; !c[g]; g ^= l || 1, f = k[f] || 1) {
      m = f ^ (f << 1) ^ (f << 2) ^ (f << 3) ^ (f << 4)
      m = (m >> 8) ^ (m & 255) ^ 99
      c[g] = m
      d[m] = g
      n = h[(e = h[(l = h[g])])]
      p = (0x1010101 * n) ^ (0x10001 * e) ^ (0x101 * l) ^ (0x1010100 * g)
      n = (0x101 * h[m]) ^ (0x1010100 * m)
      for (e = 0; 4 > e; e++)
        (a[e][g] = n = (n << 24) ^ (n >>> 8)),
          (b[e][m] = p = (p << 24) ^ (p >>> 8))
    }
    for (e = 0; 5 > e; e++) (a[e] = a[e].slice(0)), (b[e] = b[e].slice(0))
  },
}
function w(a, b, c) {
  4 !== b.length && q(new sjcl.exception.invalid('invalid aes block size'))
  var d = a.b[c],
    e = b[0] ^ d[0],
    g = b[c ? 3 : 1] ^ d[1],
    f = b[2] ^ d[2]
  b = b[c ? 1 : 3] ^ d[3]
  var h,
    k,
    l,
    n = d.length / 4 - 2,
    m,
    p = 4,
    u = [0, 0, 0, 0]
  h = a.l[c]
  a = h[0]
  var r = h[1],
    v = h[2],
    y = h[3],
    z = h[4]
  for (m = 0; m < n; m++)
    (h =
      a[e >>> 24] ^ r[(g >> 16) & 255] ^ v[(f >> 8) & 255] ^ y[b & 255] ^ d[p]),
      (k =
        a[g >>> 24] ^
        r[(f >> 16) & 255] ^
        v[(b >> 8) & 255] ^
        y[e & 255] ^
        d[p + 1]),
      (l =
        a[f >>> 24] ^
        r[(b >> 16) & 255] ^
        v[(e >> 8) & 255] ^
        y[g & 255] ^
        d[p + 2]),
      (b =
        a[b >>> 24] ^
        r[(e >> 16) & 255] ^
        v[(g >> 8) & 255] ^
        y[f & 255] ^
        d[p + 3]),
      (p += 4),
      (e = h),
      (g = k),
      (f = l)
  for (m = 0; 4 > m; m++)
    (u[c ? 3 & -m : m] =
      (z[e >>> 24] << 24) ^
      (z[(g >> 16) & 255] << 16) ^
      (z[(f >> 8) & 255] << 8) ^
      z[b & 255] ^
      d[p++]),
      (h = e),
      (e = g),
      (g = f),
      (f = b),
      (b = h)
  return u
}
sjcl.bitArray = {
  bitSlice: function (a, b, c) {
    a = sjcl.bitArray.Q(a.slice(b / 32), 32 - (b & 31)).slice(1)
    return c === s ? a : sjcl.bitArray.clamp(a, c - b)
  },
  extract: function (a, b, c) {
    var d = Math.floor((-b - c) & 31)
    return (
      (((b + c - 1) ^ b) & -32
        ? (a[(b / 32) | 0] << (32 - d)) ^ (a[(b / 32 + 1) | 0] >>> d)
        : a[(b / 32) | 0] >>> d) &
      ((1 << c) - 1)
    )
  },
  concat: function (a, b) {
    if (0 === a.length || 0 === b.length) return a.concat(b)
    var c = a[a.length - 1],
      d = sjcl.bitArray.getPartial(c)
    return 32 === d
      ? a.concat(b)
      : sjcl.bitArray.Q(b, d, c | 0, a.slice(0, a.length - 1))
  },
  bitLength: function (a) {
    var b = a.length
    return 0 === b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1])
  },
  clamp: function (a, b) {
    if (32 * a.length < b) return a
    a = a.slice(0, Math.ceil(b / 32))
    var c = a.length
    b &= 31
    0 < c &&
      b &&
      (a[c - 1] = sjcl.bitArray.partial(
        b,
        a[c - 1] & (2147483648 >> (b - 1)),
        1,
      ))
    return a
  },
  partial: function (a, b, c) {
    return 32 === a ? b : (c ? b | 0 : b << (32 - a)) + 0x10000000000 * a
  },
  getPartial: function (a) {
    return Math.round(a / 0x10000000000) || 32
  },
  equal: function (a, b) {
    if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return t
    var c = 0,
      d
    for (d = 0; d < a.length; d++) c |= a[d] ^ b[d]
    return 0 === c
  },
  Q: function (a, b, c, d) {
    var e
    e = 0
    for (d === s && (d = []); 32 <= b; b -= 32) d.push(c), (c = 0)
    if (0 === b) return d.concat(a)
    for (e = 0; e < a.length; e++)
      d.push(c | (a[e] >>> b)), (c = a[e] << (32 - b))
    e = a.length ? a[a.length - 1] : 0
    a = sjcl.bitArray.getPartial(e)
    d.push(sjcl.bitArray.partial((b + a) & 31, 32 < b + a ? c : d.pop(), 1))
    return d
  },
  d: function (a, b) {
    return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
  },
  byteswapM: function (a) {
    var b, c
    for (b = 0; b < a.length; ++b)
      (c = a[b]),
        (a[b] =
          (c >>> 24) | ((c >>> 8) & 0xff00) | ((c & 0xff00) << 8) | (c << 24))
    return a
  },
}
sjcl.codec.utf8String = {
  fromBits: function (a) {
    var b = '',
      c = sjcl.bitArray.bitLength(a),
      d,
      e
    for (d = 0; d < c / 8; d++)
      0 === (d & 3) && (e = a[d / 4]),
        (b += String.fromCharCode(e >>> 24)),
        (e <<= 8)
    return decodeURIComponent(escape(b))
  },
  toBits: function (a) {
    a = unescape(encodeURIComponent(a))
    var b = [],
      c,
      d = 0
    for (c = 0; c < a.length; c++)
      (d = (d << 8) | a.charCodeAt(c)), 3 === (c & 3) && (b.push(d), (d = 0))
    c & 3 && b.push(sjcl.bitArray.partial(8 * (c & 3), d))
    return b
  },
}
sjcl.codec.hex = {
  fromBits: function (a) {
    var b = '',
      c
    for (c = 0; c < a.length; c++)
      b += ((a[c] | 0) + 0xf00000000000).toString(16).substr(4)
    return b.substr(0, sjcl.bitArray.bitLength(a) / 4)
  },
  toBits: function (a) {
    var b,
      c = [],
      d
    a = a.replace(/\s|0x/g, '')
    d = a.length
    a += '00000000'
    for (b = 0; b < a.length; b += 8) c.push(parseInt(a.substr(b, 8), 16) ^ 0)
    return sjcl.bitArray.clamp(c, 4 * d)
  },
}
sjcl.codec.base64 = {
  K: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  fromBits: function (a, b, c) {
    var d = '',
      e = 0,
      g = sjcl.codec.base64.K,
      f = 0,
      h = sjcl.bitArray.bitLength(a)
    c && (g = g.substr(0, 62) + '-_')
    for (c = 0; 6 * d.length < h; )
      (d += g.charAt((f ^ (a[c] >>> e)) >>> 26)),
        6 > e ? ((f = a[c] << (6 - e)), (e += 26), c++) : ((f <<= 6), (e -= 6))
    for (; d.length & 3 && !b; ) d += '='
    return d
  },
  toBits: function (a, b) {
    a = a.replace(/\s|=/g, '')
    var c = [],
      d,
      e = 0,
      g = sjcl.codec.base64.K,
      f = 0,
      h
    b && (g = g.substr(0, 62) + '-_')
    for (d = 0; d < a.length; d++)
      (h = g.indexOf(a.charAt(d))),
        0 > h && q(new sjcl.exception.invalid("this isn't base64!")),
        26 < e
          ? ((e -= 26), c.push(f ^ (h >>> e)), (f = h << (32 - e)))
          : ((e += 6), (f ^= h << (32 - e)))
    e & 56 && c.push(sjcl.bitArray.partial(e & 56, f, 1))
    return c
  },
}
sjcl.codec.base64url = {
  fromBits: function (a) {
    return sjcl.codec.base64.fromBits(a, 1, 1)
  },
  toBits: function (a) {
    return sjcl.codec.base64.toBits(a, 1)
  },
}
sjcl.hash.sha256 = function (a) {
  this.b[0] || this.F()
  a
    ? ((this.r = a.r.slice(0)), (this.o = a.o.slice(0)), (this.i = a.i))
    : this.reset()
}
sjcl.hash.sha256.hash = function (a) {
  return new sjcl.hash.sha256().update(a).finalize()
}
sjcl.hash.sha256.prototype = {
  blockSize: 512,
  reset: function () {
    this.r = this.O.slice(0)
    this.o = []
    this.i = 0
    return this
  },
  update: function (a) {
    'string' === typeof a && (a = sjcl.codec.utf8String.toBits(a))
    var b,
      c = (this.o = sjcl.bitArray.concat(this.o, a))
    b = this.i
    a = this.i = b + sjcl.bitArray.bitLength(a)
    for (b = (512 + b) & -512; b <= a; b += 512) x(this, c.splice(0, 16))
    return this
  },
  finalize: function () {
    var a,
      b = this.o,
      c = this.r,
      b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)])
    for (a = b.length + 2; a & 15; a++) b.push(0)
    b.push(Math.floor(this.i / 4294967296))
    for (b.push(this.i | 0); b.length; ) x(this, b.splice(0, 16))
    this.reset()
    return c
  },
  O: [],
  b: [],
  F: function () {
    function a(a) {
      return (0x100000000 * (a - Math.floor(a))) | 0
    }
    var b = 0,
      c = 2,
      d
    a: for (; 64 > b; c++) {
      for (d = 2; d * d <= c; d++) if (0 === c % d) continue a
      8 > b && (this.O[b] = a(Math.pow(c, 0.5)))
      this.b[b] = a(Math.pow(c, 1 / 3))
      b++
    }
  },
}
function x(a, b) {
  var c,
    d,
    e,
    g = b.slice(0),
    f = a.r,
    h = a.b,
    k = f[0],
    l = f[1],
    n = f[2],
    m = f[3],
    p = f[4],
    u = f[5],
    r = f[6],
    v = f[7]
  for (c = 0; 64 > c; c++)
    16 > c
      ? (d = g[c])
      : ((d = g[(c + 1) & 15]),
        (e = g[(c + 14) & 15]),
        (d = g[c & 15] =
          (((d >>> 7) ^ (d >>> 18) ^ (d >>> 3) ^ (d << 25) ^ (d << 14)) +
            ((e >>> 17) ^ (e >>> 19) ^ (e >>> 10) ^ (e << 15) ^ (e << 13)) +
            g[c & 15] +
            g[(c + 9) & 15]) |
          0)),
      (d =
        d +
        v +
        ((p >>> 6) ^
          (p >>> 11) ^
          (p >>> 25) ^
          (p << 26) ^
          (p << 21) ^
          (p << 7)) +
        (r ^ (p & (u ^ r))) +
        h[c]),
      (v = r),
      (r = u),
      (u = p),
      (p = (m + d) | 0),
      (m = n),
      (n = l),
      (l = k),
      (k =
        (d +
          ((l & n) ^ (m & (l ^ n))) +
          ((l >>> 2) ^
            (l >>> 13) ^
            (l >>> 22) ^
            (l << 30) ^
            (l << 19) ^
            (l << 10))) |
        0)
  f[0] = (f[0] + k) | 0
  f[1] = (f[1] + l) | 0
  f[2] = (f[2] + n) | 0
  f[3] = (f[3] + m) | 0
  f[4] = (f[4] + p) | 0
  f[5] = (f[5] + u) | 0
  f[6] = (f[6] + r) | 0
  f[7] = (f[7] + v) | 0
}
sjcl.mode.ccm = {
  name: 'ccm',
  s: [],
  listenProgress: function (a) {
    sjcl.mode.ccm.s.push(a)
  },
  unListenProgress: function (a) {
    a = sjcl.mode.ccm.s.indexOf(a)
    ;-1 < a && sjcl.mode.ccm.s.splice(a, 1)
  },
  W: function (a) {
    var b = sjcl.mode.ccm.s.slice(),
      c
    for (c = 0; c < b.length; c += 1) b[c](a)
  },
  encrypt: function (a, b, c, d, e) {
    var g,
      f = b.slice(0),
      h = sjcl.bitArray,
      k = h.bitLength(c) / 8,
      l = h.bitLength(f) / 8
    e = e || 64
    d = d || []
    7 > k && q(new sjcl.exception.invalid('ccm: iv must be at least 7 bytes'))
    for (g = 2; 4 > g && l >>> (8 * g); g++);
    g < 15 - k && (g = 15 - k)
    c = h.clamp(c, 8 * (15 - g))
    b = sjcl.mode.ccm.M(a, b, c, d, e, g)
    f = sjcl.mode.ccm.p(a, f, c, b, e, g)
    return h.concat(f.data, f.tag)
  },
  decrypt: function (a, b, c, d, e) {
    e = e || 64
    d = d || []
    var g = sjcl.bitArray,
      f = g.bitLength(c) / 8,
      h = g.bitLength(b),
      k = g.clamp(b, h - e),
      l = g.bitSlice(b, h - e),
      h = (h - e) / 8
    7 > f && q(new sjcl.exception.invalid('ccm: iv must be at least 7 bytes'))
    for (b = 2; 4 > b && h >>> (8 * b); b++);
    b < 15 - f && (b = 15 - f)
    c = g.clamp(c, 8 * (15 - b))
    k = sjcl.mode.ccm.p(a, k, c, l, e, b)
    a = sjcl.mode.ccm.M(a, k.data, c, d, e, b)
    g.equal(k.tag, a) || q(new sjcl.exception.corrupt("ccm: tag doesn't match"))
    return k.data
  },
  da: function (a, b, c, d, e, g) {
    var f = [],
      h = sjcl.bitArray,
      k = h.d
    d = [h.partial(8, (b.length ? 64 : 0) | ((d - 2) << 2) | (g - 1))]
    d = h.concat(d, c)
    d[3] |= e
    d = a.encrypt(d)
    if (b.length) {
      c = h.bitLength(b) / 8
      65279 >= c
        ? (f = [h.partial(16, c)])
        : 0xffffffff >= c && (f = h.concat([h.partial(16, 65534)], [c]))
      f = h.concat(f, b)
      for (b = 0; b < f.length; b += 4)
        d = a.encrypt(k(d, f.slice(b, b + 4).concat([0, 0, 0])))
    }
    return d
  },
  M: function (a, b, c, d, e, g) {
    var f = sjcl.bitArray,
      h = f.d
    e /= 8
    ;(e % 2 || 4 > e || 16 < e) &&
      q(new sjcl.exception.invalid('ccm: invalid tag length'))
    ;(0xffffffff < d.length || 0xffffffff < b.length) &&
      q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"))
    c = sjcl.mode.ccm.da(a, d, c, e, f.bitLength(b) / 8, g)
    for (d = 0; d < b.length; d += 4)
      c = a.encrypt(h(c, b.slice(d, d + 4).concat([0, 0, 0])))
    return f.clamp(c, 8 * e)
  },
  p: function (a, b, c, d, e, g) {
    var f,
      h = sjcl.bitArray
    f = h.d
    var k = b.length,
      l = h.bitLength(b),
      n = k / 50,
      m = n
    c = h
      .concat([h.partial(8, g - 1)], c)
      .concat([0, 0, 0])
      .slice(0, 4)
    d = h.bitSlice(f(d, a.encrypt(c)), 0, e)
    if (!k) return { tag: d, data: [] }
    for (f = 0; f < k; f += 4)
      f > n && (sjcl.mode.ccm.W(f / k), (n += m)),
        c[3]++,
        (e = a.encrypt(c)),
        (b[f] ^= e[0]),
        (b[f + 1] ^= e[1]),
        (b[f + 2] ^= e[2]),
        (b[f + 3] ^= e[3])
    return { tag: d, data: h.clamp(b, l) }
  },
}
sjcl.beware === s && (sjcl.beware = {})
sjcl.beware[
  "CBC mode is dangerous because it doesn't protect message integrity."
] = function () {
  sjcl.mode.cbc = {
    name: 'cbc',
    encrypt: function (a, b, c, d) {
      d &&
        d.length &&
        q(new sjcl.exception.invalid("cbc can't authenticate data"))
      128 !== sjcl.bitArray.bitLength(c) &&
        q(new sjcl.exception.invalid('cbc iv must be 128 bits'))
      var e = sjcl.bitArray,
        g = e.d,
        f = e.bitLength(b),
        h = 0,
        k = []
      f & 7 &&
        q(
          new sjcl.exception.invalid(
            'pkcs#5 padding only works for multiples of a byte',
          ),
        )
      for (d = 0; h + 128 <= f; d += 4, h += 128)
        (c = a.encrypt(g(c, b.slice(d, d + 4)))),
          k.splice(d, 0, c[0], c[1], c[2], c[3])
      f = 0x1010101 * (16 - ((f >> 3) & 15))
      c = a.encrypt(g(c, e.concat(b, [f, f, f, f]).slice(d, d + 4)))
      k.splice(d, 0, c[0], c[1], c[2], c[3])
      return k
    },
    decrypt: function (a, b, c, d) {
      d &&
        d.length &&
        q(new sjcl.exception.invalid("cbc can't authenticate data"))
      128 !== sjcl.bitArray.bitLength(c) &&
        q(new sjcl.exception.invalid('cbc iv must be 128 bits'))
      ;(sjcl.bitArray.bitLength(b) & 127 || !b.length) &&
        q(
          new sjcl.exception.corrupt(
            'cbc ciphertext must be a positive multiple of the block size',
          ),
        )
      var e = sjcl.bitArray,
        g = e.d,
        f,
        h = []
      for (d = 0; d < b.length; d += 4)
        (f = b.slice(d, d + 4)),
          (c = g(c, a.decrypt(f))),
          h.splice(d, 0, c[0], c[1], c[2], c[3]),
          (c = f)
      f = h[d - 1] & 255
      ;(0 === f || 16 < f) &&
        q(new sjcl.exception.corrupt('pkcs#5 padding corrupt'))
      c = 0x1010101 * f
      e.equal(
        e.bitSlice([c, c, c, c], 0, 8 * f),
        e.bitSlice(h, 32 * h.length - 8 * f, 32 * h.length),
      ) || q(new sjcl.exception.corrupt('pkcs#5 padding corrupt'))
      return e.bitSlice(h, 0, 32 * h.length - 8 * f)
    },
  }
}
sjcl.mode.ocb2 = {
  name: 'ocb2',
  encrypt: function (a, b, c, d, e, g) {
    128 !== sjcl.bitArray.bitLength(c) &&
      q(new sjcl.exception.invalid('ocb iv must be 128 bits'))
    var f,
      h = sjcl.mode.ocb2.I,
      k = sjcl.bitArray,
      l = k.d,
      n = [0, 0, 0, 0]
    c = h(a.encrypt(c))
    var m,
      p = []
    d = d || []
    e = e || 64
    for (f = 0; f + 4 < b.length; f += 4)
      (m = b.slice(f, f + 4)),
        (n = l(n, m)),
        (p = p.concat(l(c, a.encrypt(l(c, m))))),
        (c = h(c))
    m = b.slice(f)
    b = k.bitLength(m)
    f = a.encrypt(l(c, [0, 0, 0, b]))
    m = k.clamp(l(m.concat([0, 0, 0]), f), b)
    n = l(n, l(m.concat([0, 0, 0]), f))
    n = a.encrypt(l(n, l(c, h(c))))
    d.length && (n = l(n, g ? d : sjcl.mode.ocb2.pmac(a, d)))
    return p.concat(k.concat(m, k.clamp(n, e)))
  },
  decrypt: function (a, b, c, d, e, g) {
    128 !== sjcl.bitArray.bitLength(c) &&
      q(new sjcl.exception.invalid('ocb iv must be 128 bits'))
    e = e || 64
    var f = sjcl.mode.ocb2.I,
      h = sjcl.bitArray,
      k = h.d,
      l = [0, 0, 0, 0],
      n = f(a.encrypt(c)),
      m,
      p,
      u = sjcl.bitArray.bitLength(b) - e,
      r = []
    d = d || []
    for (c = 0; c + 4 < u / 32; c += 4)
      (m = k(n, a.decrypt(k(n, b.slice(c, c + 4))))),
        (l = k(l, m)),
        (r = r.concat(m)),
        (n = f(n))
    p = u - 32 * c
    m = a.encrypt(k(n, [0, 0, 0, p]))
    m = k(m, h.clamp(b.slice(c), p).concat([0, 0, 0]))
    l = k(l, m)
    l = a.encrypt(k(l, k(n, f(n))))
    d.length && (l = k(l, g ? d : sjcl.mode.ocb2.pmac(a, d)))
    h.equal(h.clamp(l, e), h.bitSlice(b, u)) ||
      q(new sjcl.exception.corrupt("ocb: tag doesn't match"))
    return r.concat(h.clamp(m, p))
  },
  pmac: function (a, b) {
    var c,
      d = sjcl.mode.ocb2.I,
      e = sjcl.bitArray,
      g = e.d,
      f = [0, 0, 0, 0],
      h = a.encrypt([0, 0, 0, 0]),
      h = g(h, d(d(h)))
    for (c = 0; c + 4 < b.length; c += 4)
      (h = d(h)), (f = g(f, a.encrypt(g(h, b.slice(c, c + 4)))))
    c = b.slice(c)
    128 > e.bitLength(c) &&
      ((h = g(h, d(h))), (c = e.concat(c, [-2147483648, 0, 0, 0])))
    f = g(f, c)
    return a.encrypt(g(d(g(h, d(h))), f))
  },
  I: function (a) {
    return [
      (a[0] << 1) ^ (a[1] >>> 31),
      (a[1] << 1) ^ (a[2] >>> 31),
      (a[2] << 1) ^ (a[3] >>> 31),
      (a[3] << 1) ^ (135 * (a[0] >>> 31)),
    ]
  },
}
sjcl.mode.gcm = {
  name: 'gcm',
  encrypt: function (a, b, c, d, e) {
    var g = b.slice(0)
    b = sjcl.bitArray
    d = d || []
    a = sjcl.mode.gcm.p(!0, a, g, d, c, e || 128)
    return b.concat(a.data, a.tag)
  },
  decrypt: function (a, b, c, d, e) {
    var g = b.slice(0),
      f = sjcl.bitArray,
      h = f.bitLength(g)
    e = e || 128
    d = d || []
    e <= h
      ? ((b = f.bitSlice(g, h - e)), (g = f.bitSlice(g, 0, h - e)))
      : ((b = g), (g = []))
    a = sjcl.mode.gcm.p(t, a, g, d, c, e)
    f.equal(a.tag, b) || q(new sjcl.exception.corrupt("gcm: tag doesn't match"))
    return a.data
  },
  aa: function (a, b) {
    var c,
      d,
      e,
      g,
      f,
      h = sjcl.bitArray.d
    e = [0, 0, 0, 0]
    g = b.slice(0)
    for (c = 0; 128 > c; c++) {
      ;(d = 0 !== (a[Math.floor(c / 32)] & (1 << (31 - (c % 32))))) &&
        (e = h(e, g))
      f = 0 !== (g[3] & 1)
      for (d = 3; 0 < d; d--) g[d] = (g[d] >>> 1) | ((g[d - 1] & 1) << 31)
      g[0] >>>= 1
      f && (g[0] ^= -0x1f000000)
    }
    return e
  },
  h: function (a, b, c) {
    var d,
      e = c.length
    b = b.slice(0)
    for (d = 0; d < e; d += 4)
      (b[0] ^= 0xffffffff & c[d]),
        (b[1] ^= 0xffffffff & c[d + 1]),
        (b[2] ^= 0xffffffff & c[d + 2]),
        (b[3] ^= 0xffffffff & c[d + 3]),
        (b = sjcl.mode.gcm.aa(b, a))
    return b
  },
  p: function (a, b, c, d, e, g) {
    var f,
      h,
      k,
      l,
      n,
      m,
      p,
      u,
      r = sjcl.bitArray
    m = c.length
    p = r.bitLength(c)
    u = r.bitLength(d)
    h = r.bitLength(e)
    f = b.encrypt([0, 0, 0, 0])
    96 === h
      ? ((e = e.slice(0)), (e = r.concat(e, [1])))
      : ((e = sjcl.mode.gcm.h(f, [0, 0, 0, 0], e)),
        (e = sjcl.mode.gcm.h(f, e, [
          0,
          0,
          Math.floor(h / 0x100000000),
          h & 0xffffffff,
        ])))
    h = sjcl.mode.gcm.h(f, [0, 0, 0, 0], d)
    n = e.slice(0)
    d = h.slice(0)
    a || (d = sjcl.mode.gcm.h(f, h, c))
    for (l = 0; l < m; l += 4)
      n[3]++,
        (k = b.encrypt(n)),
        (c[l] ^= k[0]),
        (c[l + 1] ^= k[1]),
        (c[l + 2] ^= k[2]),
        (c[l + 3] ^= k[3])
    c = r.clamp(c, p)
    a && (d = sjcl.mode.gcm.h(f, h, c))
    a = [
      Math.floor(u / 0x100000000),
      u & 0xffffffff,
      Math.floor(p / 0x100000000),
      p & 0xffffffff,
    ]
    d = sjcl.mode.gcm.h(f, d, a)
    k = b.encrypt(e)
    d[0] ^= k[0]
    d[1] ^= k[1]
    d[2] ^= k[2]
    d[3] ^= k[3]
    return { tag: r.bitSlice(d, 0, g), data: c }
  },
}
sjcl.misc.hmac = function (a, b) {
  this.N = b = b || sjcl.hash.sha256
  var c = [[], []],
    d,
    e = b.prototype.blockSize / 32
  this.n = [new b(), new b()]
  a.length > e && (a = b.hash(a))
  for (d = 0; d < e; d++)
    (c[0][d] = a[d] ^ 909522486), (c[1][d] = a[d] ^ 1549556828)
  this.n[0].update(c[0])
  this.n[1].update(c[1])
  this.H = new b(this.n[0])
}
sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) {
  this.R &&
    q(new sjcl.exception.invalid('encrypt on already updated hmac called!'))
  this.update(a)
  return this.digest(a)
}
sjcl.misc.hmac.prototype.reset = function () {
  this.H = new this.N(this.n[0])
  this.R = t
}
sjcl.misc.hmac.prototype.update = function (a) {
  this.R = !0
  this.H.update(a)
}
sjcl.misc.hmac.prototype.digest = function () {
  var a = this.H.finalize(),
    a = new this.N(this.n[1]).update(a).finalize()
  this.reset()
  return a
}
sjcl.misc.pbkdf2 = function (a, b, c, d, e) {
  c = c || 1e3
  ;(0 > d || 0 > c) && q(sjcl.exception.invalid('invalid params to pbkdf2'))
  'string' === typeof a && (a = sjcl.codec.utf8String.toBits(a))
  'string' === typeof b && (b = sjcl.codec.utf8String.toBits(b))
  e = e || sjcl.misc.hmac
  a = new e(a)
  var g,
    f,
    h,
    k,
    l = [],
    n = sjcl.bitArray
  for (k = 1; 32 * l.length < (d || 1); k++) {
    e = g = a.encrypt(n.concat(b, [k]))
    for (f = 1; f < c; f++) {
      g = a.encrypt(g)
      for (h = 0; h < g.length; h++) e[h] ^= g[h]
    }
    l = l.concat(e)
  }
  d && (l = n.clamp(l, d))
  return l
}
sjcl.prng = function (a) {
  this.c = [new sjcl.hash.sha256()]
  this.j = [0]
  this.G = 0
  this.t = {}
  this.D = 0
  this.L = {}
  this.P = this.e = this.k = this.Y = 0
  this.b = [0, 0, 0, 0, 0, 0, 0, 0]
  this.g = [0, 0, 0, 0]
  this.B = s
  this.C = a
  this.q = t
  this.A = { progress: {}, seeded: {} }
  this.m = this.X = 0
  this.u = 1
  this.w = 2
  this.T = 0x10000
  this.J = [0, 48, 64, 96, 128, 192, 0x100, 384, 512, 768, 1024]
  this.U = 3e4
  this.S = 80
}
sjcl.prng.prototype = {
  randomWords: function (a, b) {
    var c = [],
      d
    d = this.isReady(b)
    var e
    d === this.m && q(new sjcl.exception.notReady("generator isn't seeded"))
    if (d & this.w) {
      d = !(d & this.u)
      e = []
      var g = 0,
        f
      this.P = e[0] = new Date().valueOf() + this.U
      for (f = 0; 16 > f; f++) e.push((0x100000000 * Math.random()) | 0)
      for (
        f = 0;
        f < this.c.length &&
        !((e = e.concat(this.c[f].finalize())),
        (g += this.j[f]),
        (this.j[f] = 0),
        !d && this.G & (1 << f));
        f++
      );
      this.G >= 1 << this.c.length &&
        (this.c.push(new sjcl.hash.sha256()), this.j.push(0))
      this.e -= g
      g > this.k && (this.k = g)
      this.G++
      this.b = sjcl.hash.sha256.hash(this.b.concat(e))
      this.B = new sjcl.cipher.aes(this.b)
      for (
        d = 0;
        4 > d && !((this.g[d] = (this.g[d] + 1) | 0), this.g[d]);
        d++
      );
    }
    for (d = 0; d < a; d += 4)
      0 === (d + 1) % this.T && A(this),
        (e = B(this)),
        c.push(e[0], e[1], e[2], e[3])
    A(this)
    return c.slice(0, a)
  },
  setDefaultParanoia: function (a, b) {
    0 === a &&
      'Setting paranoia=0 will ruin your security; use it only for testing' !==
        b &&
      q('Setting paranoia=0 will ruin your security; use it only for testing')
    this.C = a
  },
  addEntropy: function (a, b, c) {
    c = c || 'user'
    var d,
      e,
      g = new Date().valueOf(),
      f = this.t[c],
      h = this.isReady(),
      k = 0
    d = this.L[c]
    d === s && (d = this.L[c] = this.Y++)
    f === s && (f = this.t[c] = 0)
    this.t[c] = (this.t[c] + 1) % this.c.length
    switch (typeof a) {
      case 'number':
        b === s && (b = 1)
        this.c[f].update([d, this.D++, 1, b, g, 1, a | 0])
        break
      case 'object':
        c = Object.prototype.toString.call(a)
        if ('[object Uint32Array]' === c) {
          e = []
          for (c = 0; c < a.length; c++) e.push(a[c])
          a = e
        } else {
          '[object Array]' !== c && (k = 1)
          for (c = 0; c < a.length && !k; c++)
            'number' !== typeof a[c] && (k = 1)
        }
        if (!k) {
          if (b === s)
            for (c = b = 0; c < a.length; c++)
              for (e = a[c]; 0 < e; ) b++, (e >>>= 1)
          this.c[f].update([d, this.D++, 2, b, g, a.length].concat(a))
        }
        break
      case 'string':
        b === s && (b = a.length)
        this.c[f].update([d, this.D++, 3, b, g, a.length])
        this.c[f].update(a)
        break
      default:
        k = 1
    }
    k &&
      q(
        new sjcl.exception.bug(
          'random: addEntropy only supports number, array of numbers or string',
        ),
      )
    this.j[f] += b
    this.e += b
    h === this.m &&
      (this.isReady() !== this.m && C('seeded', Math.max(this.k, this.e)),
      C('progress', this.getProgress()))
  },
  isReady: function (a) {
    a = this.J[a !== s ? a : this.C]
    return this.k && this.k >= a
      ? this.j[0] > this.S && new Date().valueOf() > this.P
        ? this.w | this.u
        : this.u
      : this.e >= a
      ? this.w | this.m
      : this.m
  },
  getProgress: function (a) {
    a = this.J[a ? a : this.C]
    return this.k >= a ? 1 : this.e > a ? 1 : this.e / a
  },
  startCollectors: function () {
    this.q ||
      ((this.a = {
        loadTimeCollector: D(this, this.ca),
        mouseCollector: D(this, this.ea),
        keyboardCollector: D(this, this.ba),
        accelerometerCollector: D(this, this.V),
        touchCollector: D(this, this.ga),
      }),
      window.addEventListener
        ? (window.addEventListener('load', this.a.loadTimeCollector, t),
          window.addEventListener('mousemove', this.a.mouseCollector, t),
          window.addEventListener('keypress', this.a.keyboardCollector, t),
          window.addEventListener(
            'devicemotion',
            this.a.accelerometerCollector,
            t,
          ),
          window.addEventListener('touchmove', this.a.touchCollector, t))
        : document.attachEvent
        ? (document.attachEvent('onload', this.a.loadTimeCollector),
          document.attachEvent('onmousemove', this.a.mouseCollector),
          document.attachEvent('keypress', this.a.keyboardCollector))
        : q(new sjcl.exception.bug("can't attach event")),
      (this.q = !0))
  },
  stopCollectors: function () {
    this.q &&
      (window.removeEventListener
        ? (window.removeEventListener('load', this.a.loadTimeCollector, t),
          window.removeEventListener('mousemove', this.a.mouseCollector, t),
          window.removeEventListener('keypress', this.a.keyboardCollector, t),
          window.removeEventListener(
            'devicemotion',
            this.a.accelerometerCollector,
            t,
          ),
          window.removeEventListener('touchmove', this.a.touchCollector, t))
        : document.detachEvent &&
          (document.detachEvent('onload', this.a.loadTimeCollector),
          document.detachEvent('onmousemove', this.a.mouseCollector),
          document.detachEvent('keypress', this.a.keyboardCollector)),
      (this.q = t))
  },
  addEventListener: function (a, b) {
    this.A[a][this.X++] = b
  },
  removeEventListener: function (a, b) {
    var c,
      d,
      e = this.A[a],
      g = []
    for (d in e) e.hasOwnProperty(d) && e[d] === b && g.push(d)
    for (c = 0; c < g.length; c++) (d = g[c]), delete e[d]
  },
  ba: function () {
    E(1)
  },
  ea: function (a) {
    var b, c
    try {
      ;(b = a.x || a.clientX || a.offsetX || 0),
        (c = a.y || a.clientY || a.offsetY || 0)
    } catch (d) {
      c = b = 0
    }
    0 != b && 0 != c && sjcl.random.addEntropy([b, c], 2, 'mouse')
    E(0)
  },
  ga: function (a) {
    a = a.touches[0] || a.changedTouches[0]
    sjcl.random.addEntropy(
      [a.pageX || a.clientX, a.pageY || a.clientY],
      1,
      'touch',
    )
    E(0)
  },
  ca: function () {
    E(2)
  },
  V: function (a) {
    a =
      a.accelerationIncludingGravity.x ||
      a.accelerationIncludingGravity.y ||
      a.accelerationIncludingGravity.z
    if (window.orientation) {
      var b = window.orientation
      'number' === typeof b && sjcl.random.addEntropy(b, 1, 'accelerometer')
    }
    a && sjcl.random.addEntropy(a, 2, 'accelerometer')
    E(0)
  },
}
function C(a, b) {
  var c,
    d = sjcl.random.A[a],
    e = []
  for (c in d) d.hasOwnProperty(c) && e.push(d[c])
  for (c = 0; c < e.length; c++) e[c](b)
}
function E(a) {
  'undefined' !== typeof window &&
  window.performance &&
  'function' === typeof window.performance.now
    ? sjcl.random.addEntropy(window.performance.now(), a, 'loadtime')
    : sjcl.random.addEntropy(new Date().valueOf(), a, 'loadtime')
}
function A(a) {
  a.b = B(a).concat(B(a))
  a.B = new sjcl.cipher.aes(a.b)
}
function B(a) {
  for (var b = 0; 4 > b && !((a.g[b] = (a.g[b] + 1) | 0), a.g[b]); b++);
  return a.B.encrypt(a.g)
}
function D(a, b) {
  return function () {
    b.apply(a, arguments)
  }
}
sjcl.random = new sjcl.prng(6)
a: try {
  var F, G, H, I
  if ((I = 'undefined' !== typeof module)) {
    var J
    if ((J = module.exports)) {
      var K
      try {
        K = require('crypto')
      } catch (L) {
        K = null
      }
      J = (G = K) && G.randomBytes
    }
    I = J
  }
  if (I)
    (F = G.randomBytes(128)),
      (F = new Uint32Array(new Uint8Array(F).buffer)),
      sjcl.random.addEntropy(F, 1024, "crypto['randomBytes']")
  else if (
    'undefined' !== typeof window &&
    'undefined' !== typeof Uint32Array
  ) {
    H = new Uint32Array(32)
    if (window.crypto && window.crypto.getRandomValues)
      window.crypto.getRandomValues(H)
    else if (window.msCrypto && window.msCrypto.getRandomValues)
      window.msCrypto.getRandomValues(H)
    else break a
    sjcl.random.addEntropy(H, 1024, "crypto['getRandomValues']")
  }
} catch (M) {
  'undefined' !== typeof window &&
    window.console &&
    (console.log('There was an error collecting entropy from the browser:'),
    console.log(M))
}
sjcl.json = {
  defaults: {
    v: 1,
    iter: 1e3,
    ks: 128,
    ts: 64,
    mode: 'ccm',
    adata: '',
    cipher: 'aes',
  },
  $: function (a, b, c, d) {
    c = c || {}
    d = d || {}
    var e = sjcl.json,
      g = e.f({ iv: sjcl.random.randomWords(4, 0) }, e.defaults),
      f
    e.f(g, c)
    c = g.adata
    'string' === typeof g.salt && (g.salt = sjcl.codec.base64.toBits(g.salt))
    'string' === typeof g.iv && (g.iv = sjcl.codec.base64.toBits(g.iv))
    ;(!sjcl.mode[g.mode] ||
      !sjcl.cipher[g.cipher] ||
      ('string' === typeof a && 100 >= g.iter) ||
      (64 !== g.ts && 96 !== g.ts && 128 !== g.ts) ||
      (128 !== g.ks && 192 !== g.ks && 0x100 !== g.ks) ||
      2 > g.iv.length ||
      4 < g.iv.length) &&
      q(new sjcl.exception.invalid('json encrypt: invalid parameters'))
    'string' === typeof a
      ? ((f = sjcl.misc.cachedPbkdf2(a, g)),
        (a = f.key.slice(0, g.ks / 32)),
        (g.salt = f.salt))
      : sjcl.ecc &&
        a instanceof sjcl.ecc.elGamal.publicKey &&
        ((f = a.kem()), (g.kemtag = f.tag), (a = f.key.slice(0, g.ks / 32)))
    'string' === typeof b && (b = sjcl.codec.utf8String.toBits(b))
    'string' === typeof c && (g.adata = c = sjcl.codec.utf8String.toBits(c))
    f = new sjcl.cipher[g.cipher](a)
    e.f(d, g)
    d.key = a
    g.ct =
      'ccm' === g.mode &&
      sjcl.arrayBuffer &&
      sjcl.arrayBuffer.ccm &&
      b instanceof ArrayBuffer
        ? sjcl.arrayBuffer.ccm.encrypt(f, b, g.iv, c, g.ts)
        : sjcl.mode[g.mode].encrypt(f, b, g.iv, c, g.ts)
    return g
  },
  encrypt: function (a, b, c, d) {
    var e = sjcl.json,
      g = e.$.apply(e, arguments)
    return e.encode(g)
  },
  Z: function (a, b, c, d) {
    c = c || {}
    d = d || {}
    var e = sjcl.json
    b = e.f(e.f(e.f({}, e.defaults), b), c, !0)
    var g, f
    g = b.adata
    'string' === typeof b.salt && (b.salt = sjcl.codec.base64.toBits(b.salt))
    'string' === typeof b.iv && (b.iv = sjcl.codec.base64.toBits(b.iv))
    ;(!sjcl.mode[b.mode] ||
      !sjcl.cipher[b.cipher] ||
      ('string' === typeof a && 100 >= b.iter) ||
      (64 !== b.ts && 96 !== b.ts && 128 !== b.ts) ||
      (128 !== b.ks && 192 !== b.ks && 0x100 !== b.ks) ||
      !b.iv ||
      2 > b.iv.length ||
      4 < b.iv.length) &&
      q(new sjcl.exception.invalid('json decrypt: invalid parameters'))
    'string' === typeof a
      ? ((f = sjcl.misc.cachedPbkdf2(a, b)),
        (a = f.key.slice(0, b.ks / 32)),
        (b.salt = f.salt))
      : sjcl.ecc &&
        a instanceof sjcl.ecc.elGamal.secretKey &&
        (a = a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0, b.ks / 32))
    'string' === typeof g && (g = sjcl.codec.utf8String.toBits(g))
    f = new sjcl.cipher[b.cipher](a)
    g =
      'ccm' === b.mode &&
      sjcl.arrayBuffer &&
      sjcl.arrayBuffer.ccm &&
      b.ct instanceof ArrayBuffer
        ? sjcl.arrayBuffer.ccm.decrypt(f, b.ct, b.iv, b.tag, g, b.ts)
        : sjcl.mode[b.mode].decrypt(f, b.ct, b.iv, g, b.ts)
    e.f(d, b)
    d.key = a
    return 1 === c.raw ? g : sjcl.codec.utf8String.fromBits(g)
  },
  decrypt: function (a, b, c, d) {
    var e = sjcl.json
    return e.Z(a, e.decode(b), c, d)
  },
  encode: function (a) {
    var b,
      c = '{',
      d = ''
    for (b in a)
      if (a.hasOwnProperty(b))
        switch (
          (b.match(/^[a-z0-9]+$/i) ||
            q(new sjcl.exception.invalid('json encode: invalid property name')),
          (c += d + '"' + b + '":'),
          (d = ','),
          typeof a[b])
        ) {
          case 'number':
          case 'boolean':
            c += a[b]
            break
          case 'string':
            c += '"' + escape(a[b]) + '"'
            break
          case 'object':
            c += '"' + sjcl.codec.base64.fromBits(a[b], 0) + '"'
            break
          default:
            q(new sjcl.exception.bug('json encode: unsupported type'))
        }
    return c + '}'
  },
  decode: function (a) {
    a = a.replace(/\s/g, '')
    a.match(/^\{.*\}$/) ||
      q(new sjcl.exception.invalid("json decode: this isn't json!"))
    a = a.replace(/^\{|\}$/g, '').split(/,/)
    var b = {},
      c,
      d
    for (c = 0; c < a.length; c++)
      (d = a[c].match(
        /^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i,
      )) || q(new sjcl.exception.invalid("json decode: this isn't json!")),
        null != d[3]
          ? (b[d[2]] = parseInt(d[3], 10))
          : null != d[4]
          ? (b[d[2]] = d[2].match(/^(ct|adata|salt|iv)$/)
              ? sjcl.codec.base64.toBits(d[4])
              : unescape(d[4]))
          : null != d[5] && (b[d[2]] = 'true' === d[5])
    return b
  },
  f: function (a, b, c) {
    a === s && (a = {})
    if (b === s) return a
    for (var d in b)
      b.hasOwnProperty(d) &&
        (c &&
          a[d] !== s &&
          a[d] !== b[d] &&
          q(new sjcl.exception.invalid('required parameter overridden')),
        (a[d] = b[d]))
    return a
  },
  ia: function (a, b) {
    var c = {},
      d
    for (d in a) a.hasOwnProperty(d) && a[d] !== b[d] && (c[d] = a[d])
    return c
  },
  ha: function (a, b) {
    var c = {},
      d
    for (d = 0; d < b.length; d++) a[b[d]] !== s && (c[b[d]] = a[b[d]])
    return c
  },
}
sjcl.encrypt = sjcl.json.encrypt
sjcl.decrypt = sjcl.json.decrypt
sjcl.misc.fa = {}
sjcl.misc.cachedPbkdf2 = function (a, b) {
  var c = sjcl.misc.fa,
    d
  b = b || {}
  d = b.iter || 1e3
  c = c[a] = c[a] || {}
  d = c[d] = c[d] || {
    firstSalt:
      b.salt && b.salt.length ? b.salt.slice(0) : sjcl.random.randomWords(2, 0),
  }
  c = b.salt === s ? d.firstSalt : b.salt
  d[c] = d[c] || sjcl.misc.pbkdf2(a, c, b.iter)
  return { key: d[c].slice(0), salt: c.slice(0) }
}
