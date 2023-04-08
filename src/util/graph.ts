import { Maybe, Warning } from "./primitiveTypes";

export type Node = string;

export class Graph {
  nodes: { [key: Node]: Node[] };

  constructor() {
    /*
     *  ex)
     *    nodes = {
     *      0: [ 1, 2 ],
     *      1: [ 0 ],
     *      2: [ 0 ]
     *    }
     */
    this.nodes = {};
  }

  getNodeList() {
    return Object.keys(this.nodes);
  }

  getNodeNumber() {
    return this.getNodeList().length;
  }

  addNode(node: Node) {
    this.nodes[node] = this.nodes[node] || [];
  }

  contains(node: Node) {
    return this.nodes.hasOwnProperty(node);
  }

  removeNode(node: Node) {
    if (this.nodes[node].length === 0) {
      delete this.nodes[node];
    } else {
      for (const value of this.nodes[node]) {
        this.removeEdge(node, value);
      }
    }
  }

  hasDirectedEdge(from_node: Node, to_node: Node) {
    let bool = false;
    const from = this.nodes[from_node].some((el) => el === to_node);
    if (from) {
      bool = true;
    }
    return bool;
  }

  hasEdge(from_node: Node, to_node: Node) {
    this.hasDirectedEdge(from_node, to_node) &&
      this.hasDirectedEdge(to_node, from_node);
  }

  addEdge(from_node: Node, to_node: Node, safely: boolean = false) {
    this.addDirectedEdge(from_node, to_node);
    this.addDirectedEdge(to_node, from_node);
  }

  addDirectedEdge(from_node: Node, to_node: Node, safely: boolean = false) {
    if (!safely && !this.hasDirectedEdge(from_node, to_node)) {
      this.nodes[from_node].push(to_node);
    }
  }

  removeDirectedEdge(from_node: Node, to_node: Node) {
    this.nodes[from_node].splice(this.nodes[from_node].indexOf(to_node), 1);
  }

  removeEdge(from_node: Node, to_node: Node) {
    this.removeDirectedEdge(from_node, to_node);
    this.removeDirectedEdge(to_node, from_node);
  }

  dfs(start_node?: Node, visited?: { [key: string]: boolean }): Array<Node> {
    let visited_list: Array<Node> = [];
    if (visited == undefined) {
      visited = {};
    }
    if (start_node == undefined) {
      Object.keys(this.nodes).forEach((e) => {
        if (visited != undefined && !visited[e]) {
          visited_list = visited_list.concat(this.dfs(e, visited));
        }
      });
    } else {
      visited[start_node] = true;
      visited_list.push(start_node);
      this.nodes[start_node].forEach((e) => {
        if (visited != undefined && !visited[e]) {
          visited_list = visited_list.concat(this.dfs(e, visited));
        }
      });
    }
    return visited_list;
  }

  hasCycle(
    start_node?: Node,
    visited?: { [key: string]: boolean },
    parents?: { [key: string]: boolean }
  ): boolean {
    if (visited == undefined) {
      visited = {};
    }
    if (parents == undefined) {
      parents = {};
    }
    if (start_node == undefined) {
      for (let e of Object.keys(this.nodes)) {
        if (visited != undefined) {
          if (!visited[e] && this.hasCycle(e, visited, {})) {
            return true;
          }
        }
      }
    } else {
      visited[start_node] = true;
      parents[start_node] = true;
      for (let e of this.nodes[start_node]) {
        if (visited != undefined && parents != undefined) {
          if (!visited[e]) {
            if (this.hasCycle(e, visited, parents)) {
              return true;
            }
          } else {
            if (parents[e]) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  dfsIfAcyclic(): Maybe<Array<Node>> {
    if (this.hasCycle()) {
      return new Warning(
        "그래프에서 사이클이 발견되었어요.",
        "Graph.dfsIfAcyclic"
      );
    }
    return this.dfs();
  }

  topologicalSort(): Maybe<Array<Node>> {
    if (this.hasCycle()) {
      return new Warning(
        "정렬이 불가능한 그래프입니다.",
        "Graph.topologicalSort"
      );
    }
    return this.dfsEndList().reverse();
  }

  dfsEndList(
    start_node?: Node,
    visited?: { [key: string]: boolean }
  ): Array<Node> {
    let end_list: Array<Node> = [];
    if (visited == undefined) {
      visited = {};
    }
    if (start_node == undefined) {
      Object.keys(this.nodes).forEach((e) => {
        if (visited != undefined && !visited[e]) {
          end_list = end_list.concat(this.dfsEndList(e, visited));
        }
      });
    } else {
      visited[start_node] = true;
      this.nodes[start_node].forEach((e) => {
        if (visited != undefined && !visited[e]) {
          end_list = end_list.concat(this.dfsEndList(e, visited));
        }
      });
      end_list.push(start_node);
    }
    return end_list;
  }

  getInitialNodeList(): Array<Node> {
    const node_list = this.getNodeList();
    const noninitial_node_set: Set<Node> = new Set();
    for (let from_node of node_list) {
      for (let to_node of this.nodes[from_node]) {
        noninitial_node_set.add(to_node);
      }
    }
    return node_list.filter((node) => !noninitial_node_set.has(node));
  }

  getTerminalNodeList(): Array<Node> {
    return this.getNodeList().filter((node) => this.nodes[node].length === 0);
  }
}
