export function isPending(self) {
     return self.state.pending;
}

export function setPending(bool, self) {
     self.setState({
          pending: bool
     });
}
