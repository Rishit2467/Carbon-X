# 🦁 Freighter Setup for Brave Browser

## Quick Fix for Brave Users

Brave's enhanced privacy features can block Freighter's script injection. Here's how to fix it:

### Method 1: Disable Shields for Carbon-X (Recommended)

1. **Visit Carbon-X marketplace**
   ```
   https://carbon-d4j7v9u7n-cubetricks24-4687s-projects.vercel.app
   ```

2. **Click the Brave Shield icon** (🦁 in address bar)

3. **Toggle "Shields" to OFF** for this site
   - This allows Freighter to inject properly
   - Only affects Carbon-X, not other sites

4. **Refresh the page** (F5 or Ctrl+R)

5. **Click "Freighter" button** - should work now! ✅

### Method 2: Allow Scripts Globally

1. **Go to Brave Settings**
   ```
   brave://settings/shields
   ```

2. **Under "Advanced View"**
   - Set "Block scripts" to **OFF**
   - OR add Carbon-X to allowed sites

3. **Refresh Carbon-X page**

### Method 3: Extension Permissions

1. **Open Brave Extensions**
   ```
   brave://extensions/
   ```

2. **Find "Freighter"**

3. **Click "Details" button**

4. **Verify these settings:**
   - ✅ Extension is enabled (toggle ON)
   - ✅ "Allow in Incognito" is checked (if using incognito)
   - ✅ "Site access" is set to "On all sites"

5. **Refresh Carbon-X**

## Verification Steps

### 1. Install Freighter (if not installed)

```
1. Visit: https://www.freighter.app/
2. Click "Download for Brave"
   (Uses Chrome Web Store - Brave is Chromium-based)
3. Click "Add to Brave"
4. Create or import wallet
5. Unlock wallet
```

### 2. Check Freighter is Working

**Test on diagnostic page:**
```
https://carbon-d4j7v9u7n-cubetricks24-4687s-projects.vercel.app/check-freighter.html
```

**Expected result:**
- ✅ "Freighter wallet detected!"
- Can click "Connect Wallet"
- Can see your address

**If still issues:**
- Open Console (F12 → Console tab)
- Look for: `window.freighterApi` or `window.freighter`
- Should not be `undefined`

### 3. Test on Carbon-X

1. Go to marketplace
2. Click "Freighter" button
3. Should show "Connecting..."
4. Freighter popup appears → Approve
5. Your address displays in header ✅

## Common Issues & Fixes

### Issue: "Freighter not detected"

**Solution:**
```
1. brave://extensions/ → Verify Freighter enabled
2. Brave shield → Disable for Carbon-X
3. Hard refresh: Ctrl+Shift+R
4. Try incognito with extension allowed
```

### Issue: "Please unlock Freighter"

**Solution:**
```
1. Click Freighter icon in toolbar
2. Enter password
3. Should show your wallet address
4. Refresh Carbon-X and try again
```

### Issue: Connection approved but nothing happens

**Solution:**
```
1. Check Console (F12) for errors
2. Verify network is "Testnet"
3. Disable other Stellar/wallet extensions
4. Clear browser cache and cookies for site
5. Restart Brave
```

### Issue: Script blocked by Brave

**Solution:**
```
1. Click Brave shield icon
2. "Advanced controls"
3. Enable "Cross-site cookies blocked"
4. Disable "Block scripts"
5. Refresh page
```

## Why Brave Blocks Freighter

Brave's privacy features:
- **Content blocking** - Blocks third-party scripts
- **Fingerprinting protection** - Blocks extension detection
- **Script blocking** - Prevents script injection

Freighter needs to:
- Inject `window.freighterApi` object
- Communicate with webpage
- Access wallet data

**This is safe** because:
- ✅ Freighter is open-source
- ✅ Runs only in your browser
- ✅ You approve all transactions
- ✅ Private keys never exposed

## Alternative: Manual Connection

If Freighter detection still fails, use Manual mode:

```
1. Click "Manual" button (not "Freighter")
2. Open Freighter extension
3. Copy your address (starts with G...)
4. Paste into Carbon-X input
5. Click "Connect"
```

**⚠️ Note:** Manual mode is view-only. You won't be able to:
- Sign transactions
- Buy credits with XLM
- Retire credits

For full functionality, Freighter detection must work.

## Recommended Brave Settings for Web3

For best Web3 experience in Brave:

```
brave://settings/shields
```

**Set these:**
- ✅ Trackers & ads blocking: Standard (not Aggressive)
- ✅ Block scripts: OFF (or add Web3 sites to allow list)
- ✅ Block fingerprinting: Standard (not Strict)
- ❌ Don't upgrade connections to HTTPS (some dApps need HTTP localhost)

## Success Indicators

You know it's working when:

1. ✅ Click "Freighter" → Shows "Connecting..."
2. ✅ Freighter popup appears automatically
3. ✅ After approval → Your address in header
4. ✅ Console shows: "✅ Freighter found!"
5. ✅ Can buy credits → Freighter signature popup

## Still Not Working?

Try these in order:

1. **Restart Brave completely**
2. **Reinstall Freighter extension**
3. **Test in Chrome/Edge** (to verify it's Brave-specific)
4. **Disable ALL other extensions** temporarily
5. **Try different network** (WiFi vs Ethernet)
6. **Check Freighter version** (should be latest)
7. **Report issue** with Console logs

## Browser Alternatives

If Brave continues to have issues:

- ✅ **Chrome** - Best Freighter support
- ✅ **Edge** - Works well
- ✅ **Firefox** - Official support
- ⚠️ **Brave** - Requires shield adjustments
- ❌ **Safari** - Not supported

## Contact & Support

**Freighter Issues:**
- Docs: https://docs.freighter.app/
- Discord: https://discord.gg/freighter
- GitHub: https://github.com/stellar/freighter

**Carbon-X Issues:**
- Check Console logs (F12)
- Use diagnostic page
- Report with browser version

---

🦁 **Brave + Freighter = Privacy + DeFi** 🚀

Just needs a quick shield toggle and you're ready to trade carbon credits!
