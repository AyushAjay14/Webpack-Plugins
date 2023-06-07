class WatchRunPlugin {
    constructor(){
        this.firstRun = true;
    }
    apply(compiler) {
        compiler.hooks.watchRun.tap('WatchRun', (comp) => {
            
        });
    }
    getChangedFile(compiler) {
        const { watchFileSystem } = compiler
        const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher
        const changedFile = Object.keys(watcher.mtimes)
        return changedFile
      }
}
module.exports = WatchRunPlugin;