# Preview System Diagnostic Fixes

This document outlines the diagnostic fixes implemented to identify and resolve the blank preview issue.

## 🎯 What Was Added

### 1. **Enhanced Logging & Error Handling**
- Added comprehensive console logging throughout the preview mounting process
- Enhanced error overlays with specific error messages
- Added debug information display in development mode

### 2. **Babel Standalone Verification**
- Added script in `root.tsx` to verify Babel loads from CDN
- Console logging confirms if Babel is available for JSX transformation
- Error message if Babel fails to load

### 3. **Development Shims Validation**
- Enhanced `setupDevShims()` with library availability checks
- Validates React, ReactDOM, use-vibes, call-ai are available
- Console logging confirms successful setup

### 4. **Test Mode Toggle**
- Added test mode button in SessionView (development only)
- Allows switching between normal preview and test component
- Simple test component verifies basic React mounting

### 5. **Detailed Mount Process Logging**
- Logs each step: container check, Babel check, token retrieval, mounting
- Captures environment information for debugging
- Tracks mount success/failure events

## 🔍 How to Debug

### Step 1: Open Browser Console
1. Open the app in your browser
2. Press `F12` to open developer tools
3. Go to the **Console** tab

### Step 2: Look for Debug Messages
You should see messages like:
```
[Root] Babel standalone loaded successfully
[InlinePreview] Starting preview mount
[InlinePreview] Dev shims setup complete
[MountVibeCode] Starting mount process
```

### Step 3: Check for Errors
Look for error messages that indicate where the process fails:
- `Babel not loaded` - CDN script failed to load
- `Container element not found` - DOM element missing
- `App component is not defined` - React component export issue
- Library availability errors in dev shims

### Step 4: Use Test Mode
1. Look for "Test Preview" button in top-right corner (development only)
2. Click to toggle test mode
3. A simple test component should appear with interactive counter
4. If test works, the issue is with code processing, not basic mounting

### Step 5: Check Debug Info
In development mode, you'll see debug info overlay showing:
- `codeReady` status
- `codeLength` (character count)
- `error` state (none or specific error)

## 🚨 Common Issues & Solutions

### Issue: "Babel not loaded"
**Solution:** Check network connection, CDN might be blocked
- Verify `https://unpkg.com/@babel/standalone/babel.min.js` loads in Network tab
- Try different CDN: `https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js`

### Issue: "Container element not found"
**Solution:** React rendering issue
- Check if container div exists in DOM
- Verify component lifecycle mounting order

### Issue: "App component is not defined"
**Solution:** Code processing issue
- Check if user code has `export default function App()` 
- Verify import transformations work correctly

### Issue: Silent failure (no errors, blank screen)
**Solutions:**
1. Check if dev shims setup completes successfully
2. Verify all required libraries load (React, ReactDOM, etc.)
3. Try test mode to isolate the issue

## 🧪 Testing the Fixes

1. **Start the app:** `pnpm dev`
2. **Open browser console** (F12)
3. **Generate some code** or use test mode
4. **Monitor console output** for detailed logs
5. **Check for specific error messages** in preview area
6. **Use test mode** to verify basic functionality

## 📝 Files Modified

- `vibes.diy/pkg/app/components/ResultPreview/InlinePreview.tsx` - Enhanced logging and error handling
- `vibes.diy/pkg/app/utils/dev-shims.ts` - Library validation and logging  
- `vibes.diy/pkg/app/root.tsx` - Babel verification script
- `vibes.diy/pkg/app/components/SessionView.tsx` - Test mode toggle
- `use-vibes/base/mounting/mountVibeCode.ts` - Detailed mounting logs
- `vibes.diy/pkg/app/components/ResultPreview/PreviewTestComponent.tsx` - Test component (new)

## 🎯 Expected Behavior After Fixes

1. **Console shows detailed logs** of each mounting step
2. **Error messages are specific** instead of silent failures
3. **Debug info displays** current state parameters
4. **Test mode works** if basic React mounting functions
5. **Babel loading verified** before mounting attempts

These fixes should help pinpoint exactly where the preview system fails and provide clear error messages for troubleshooting.