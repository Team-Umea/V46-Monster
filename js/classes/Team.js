//Class for teams
export class Team{
    constructor(teamName){
        this.name = teamName;
        this.monsters = [];
        this.paidFor = false;

    }
    getPaidFor() {
        return this.paidFor;
      }
    setPaidFor(status) {
        this.paidFor = status;
      }
      getMonsters(){
        return this.monsters;
      }
      setMonsters(monsters) {
        this.monsters = monsters;
      }
      getVisible() {
        return this.visible;
      }
      setVisible(visible) {
        this.visible = visible;
      }
      addMonsterToTeam(monster){
        this.monsters.push(monster);
      }
    static fromJSON(json) {
        const newTeam = new Team(json.teamName);
        newTeam.setMonsters(json.monsters);
        newTeam.setPaidFor(json.paidFor);
        newTeam.setVisible(json.visible);
        return newTeam;
      }
      
}